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

async function debugUser() {
  console.log("🔍 Hendrix User Debug Tool");
  console.log("===========================\n");

  try {
    // Load Amplify configuration
    const config = loadAmplifyConfig();
    const cognitoAdmin = new CognitoAdmin(
      config.auth.aws_region,
      config.auth.user_pool_id
    );

    const email = await question("Enter user email to debug: ");

    console.log(`\n🔍 Debugging user: ${email}`);
    console.log("=".repeat(50));

    // Get user info
    const user = await cognitoAdmin.getUser(email);
    if (!user) {
      console.log("❌ User not found in Cognito");
      return;
    }

    console.log("\n👤 User Information:");
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Username: ${user.Username}`);
    console.log(`📊 Status: ${user.UserStatus}`);
    console.log(`📅 Created: ${user.UserCreateDate?.toLocaleDateString()}`);
    console.log(
      `🔄 Modified: ${user.UserLastModifiedDate?.toLocaleDateString()}`
    );

    // Get user groups
    const groups = await cognitoAdmin.getUserGroups(email);
    console.log(`\n👥 Groups (${groups.length}):`);
    if (groups.length === 0) {
      console.log("❌ No groups assigned!");
      console.log("💡 This is likely why admin access is denied.");
      console.log("💡 Run: npm run manage-users");
      console.log("💡 Choose option 3 to add user to super_admins group");
    } else {
      groups.forEach((group) => {
        console.log(`✅ ${group}`);
        if (group === "super_admins") {
          console.log("   🎯 This user should have admin access");
        }
      });
    }

    // Show user attributes
    if (user.UserAttributes) {
      console.log("\n📋 User Attributes:");
      for (const attr of user.UserAttributes) {
        console.log(`   ${attr.Name}: ${attr.Value}`);
      }
    }

    // Check if email is verified
    const emailVerified = user.UserAttributes?.find(
      (attr) => attr.Name === "email_verified"
    )?.Value;
    if (emailVerified !== "true") {
      console.log("\n⚠️  Email not verified!");
      console.log("💡 This might prevent sign-in");
    }

    // Show recommendations
    console.log("\n🔧 Troubleshooting Steps:");
    console.log("1. Ensure user is in 'super_admins' group");
    console.log("2. Check user status is 'CONFIRMED'");
    console.log("3. Verify email is confirmed");
    console.log("4. Try signing in with correct password");
    console.log("5. Check browser console for auth errors");

    if (user.UserStatus !== "CONFIRMED") {
      console.log(
        `\n⚠️  User status is '${user.UserStatus}' instead of 'CONFIRMED'`
      );
      console.log(
        "💡 User may need to confirm their account or reset password"
      );
    }
  } catch (error: any) {
    console.error("❌ Error debugging user:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
debugUser();
