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

async function listUsers(cognitoAdmin: CognitoAdmin) {
  console.log("\n👥 Users in the system:");
  console.log("========================");

  const users = await cognitoAdmin.listUsers();

  if (users.length === 0) {
    console.log("No users found.");
    return;
  }

  for (const user of users) {
    const email =
      user.Attributes?.find((attr) => attr.Name === "email")?.Value || "N/A";
    const status = user.UserStatus;
    const groups = await cognitoAdmin.getUserGroups(user.Username!);

    console.log(`📧 ${email}`);
    console.log(`   Username: ${user.Username}`);
    console.log(`   Status: ${status}`);
    console.log(`   Groups: ${groups.length > 0 ? groups.join(", ") : "None"}`);
    console.log(`   Created: ${user.UserCreateDate?.toLocaleDateString()}`);
    console.log("");
  }
}

async function addUserToGroup(cognitoAdmin: CognitoAdmin) {
  const email = await question("User email: ");
  const groupName = await question("Group name (super_admins/admins/users): ");

  try {
    await cognitoAdmin.addUserToGroup(email, groupName);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

async function removeUserFromGroup(cognitoAdmin: CognitoAdmin) {
  const email = await question("User email: ");
  const groupName = await question("Group name: ");

  try {
    await cognitoAdmin.removeUserFromGroup(email, groupName);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

async function showUserInfo(cognitoAdmin: CognitoAdmin) {
  const email = await question("User email: ");

  try {
    const user = await cognitoAdmin.getUser(email);
    if (!user) {
      console.log("❌ User not found");
      return;
    }

    const groups = await cognitoAdmin.getUserGroups(email);

    console.log("\n👤 User Information:");
    console.log("====================");
    console.log(`📧 Email: ${email}`);
    console.log(`👤 Username: ${user.Username}`);
    console.log(`📊 Status: ${user.UserStatus}`);
    console.log(`👥 Groups: ${groups.length > 0 ? groups.join(", ") : "None"}`);
    console.log(`📅 Created: ${user.UserCreateDate?.toLocaleDateString()}`);
    console.log(
      `🔄 Modified: ${user.UserLastModifiedDate?.toLocaleDateString()}`
    );

    if (user.UserAttributes) {
      console.log("\n📋 Attributes:");
      for (const attr of user.UserAttributes) {
        if (attr.Name !== "email") {
          console.log(`   ${attr.Name}: ${attr.Value}`);
        }
      }
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

async function deleteUser(cognitoAdmin: CognitoAdmin) {
  const email = await question("User email to delete: ");
  const confirm = await question(
    `⚠️  Are you sure you want to delete ${email}? (yes/no): `
  );

  if (confirm.toLowerCase() !== "yes") {
    console.log("❌ Cancelled");
    return;
  }

  try {
    await cognitoAdmin.deleteUser(email);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

async function listGroups(cognitoAdmin: CognitoAdmin) {
  console.log("\n👥 Groups in the system:");
  console.log("=========================");

  const groups = await cognitoAdmin.listGroups();

  if (groups.length === 0) {
    console.log("No groups found.");
    return;
  }

  for (const group of groups) {
    console.log(`🏷️  ${group.GroupName}`);
    console.log(`   Description: ${group.Description || "N/A"}`);
    console.log(`   Created: ${group.CreationDate?.toLocaleDateString()}`);
    console.log("");
  }
}

async function createGroup(cognitoAdmin: CognitoAdmin) {
  const groupName = await question("Group name: ");
  const description = await question("Description (optional): ");

  try {
    await cognitoAdmin.createGroup(groupName, description || undefined);
  } catch (error: any) {
    console.error("❌ Error:", error.message);
  }
}

async function showMenu() {
  console.log("\n🛠️  User Management Menu");
  console.log("========================");
  console.log("1. List all users");
  console.log("2. Show user info");
  console.log("3. Add user to group");
  console.log("4. Remove user from group");
  console.log("5. Delete user");
  console.log("6. List groups");
  console.log("7. Create group");
  console.log("0. Exit");
  console.log("");
}

async function manageUsers() {
  console.log("🛠️  Hendrix User Management");
  console.log("============================\n");

  try {
    // Load Amplify configuration
    const config = loadAmplifyConfig();
    const cognitoAdmin = new CognitoAdmin(
      config.auth.aws_region,
      config.auth.user_pool_id
    );

    while (true) {
      await showMenu();
      const choice = await question("Choose an option: ");

      switch (choice) {
        case "1":
          await listUsers(cognitoAdmin);
          break;
        case "2":
          await showUserInfo(cognitoAdmin);
          break;
        case "3":
          await addUserToGroup(cognitoAdmin);
          break;
        case "4":
          await removeUserFromGroup(cognitoAdmin);
          break;
        case "5":
          await deleteUser(cognitoAdmin);
          break;
        case "6":
          await listGroups(cognitoAdmin);
          break;
        case "7":
          await createGroup(cognitoAdmin);
          break;
        case "0":
          console.log("👋 Goodbye!");
          process.exit(0);
        default:
          console.log("❌ Invalid option. Please try again.");
      }

      await question("\nPress Enter to continue...");
    }
  } catch (error: any) {
    console.error("❌ Error:", error.message);
    process.exit(1);
  } finally {
    rl.close();
  }
}

// Run the script
manageUsers();
