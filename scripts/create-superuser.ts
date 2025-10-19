#!/usr/bin/env tsx

import { CognitoAdmin } from "./lib/cognito-admin";
import { loadAmplifyConfig } from "./lib/config";
import { createInterface } from "readline";

const rl = createInterface({
  input: process.stdin,
  output: process.stdout,
});

function question(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    rl.question(prompt, resolve);
  });
}

function questionHidden(prompt: string): Promise<string> {
  return new Promise((resolve) => {
    process.stdout.write(prompt);
    process.stdin.setRawMode(true);
    process.stdin.resume();
    process.stdin.setEncoding("utf8");

    let input = "";
    const onData = (char: string) => {
      switch (char) {
        case "\n":
        case "\r":
        case "\u0004": // Ctrl+D
          process.stdin.setRawMode(false);
          process.stdin.pause();
          process.stdin.removeListener("data", onData);
          process.stdout.write("\n");
          resolve(input);
          break;
        case "\u0003": // Ctrl+C
          process.exit();
          break;
        case "\u007f": // Backspace
          if (input.length > 0) {
            input = input.slice(0, -1);
            process.stdout.write("\b \b");
          }
          break;
        default:
          input += char;
          process.stdout.write("*");
          break;
      }
    };

    process.stdin.on("data", onData);
  });
}

async function createSuperuser() {
  console.log("🚀 Hendrix Superuser Creation");
  console.log("==============================\n");

  try {
    // Load Amplify configuration
    const config = loadAmplifyConfig();
    const cognitoAdmin = new CognitoAdmin(
      config.auth.aws_region,
      config.auth.user_pool_id
    );

    // Get user input
    const email = await question("Email address: ");
    if (!email || !email.includes("@")) {
      console.error("❌ Please enter a valid email address");
      process.exit(1);
    }

    const password = await questionHidden("Password: ");
    if (!password || password.length < 8) {
      console.error("❌ Password must be at least 8 characters long");
      process.exit(1);
    }

    const confirmPassword = await questionHidden("Password (again): ");
    if (password !== confirmPassword) {
      console.error("❌ Passwords don't match");
      process.exit(1);
    }

    console.log("\n🔄 Creating superuser...");

    // Check if user already exists
    const existingUser = await cognitoAdmin.getUser(email);
    if (existingUser) {
      console.log(`⚠️  User ${email} already exists`);
      const addToGroup = await question("Add to super_admins group? (y/N): ");
      if (
        addToGroup.toLowerCase() === "y" ||
        addToGroup.toLowerCase() === "yes"
      ) {
        await cognitoAdmin.addUserToGroup(email, "super_admins");
        console.log("✅ User added to super_admins group");
      }
    } else {
      // Create user
      await cognitoAdmin.createUser(email, password, true);

      // Add to super_admins group
      await cognitoAdmin.addUserToGroup(email, "super_admins");
    }

    // Show user info
    const groups = await cognitoAdmin.getUserGroups(email);
    console.log("\n✅ Superuser created successfully!");
    console.log(`📧 Email: ${email}`);
    console.log(`👥 Groups: ${groups.join(", ")}`);
    console.log("\n🎉 You can now sign in to the admin panel!");
  } catch (error: any) {
    console.error("❌ Error creating superuser:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
createSuperuser();
