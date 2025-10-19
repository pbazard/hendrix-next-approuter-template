#!/usr/bin/env tsx

import { CognitoAdmin } from "./lib/cognito-admin";
import { loadAmplifyConfig } from "./lib/config";

async function initializeGroups() {
  console.log("🚀 Initializing Hendrix User Groups");
  console.log("====================================\n");

  try {
    // Load Amplify configuration
    const config = loadAmplifyConfig();
    const cognitoAdmin = new CognitoAdmin(
      config.auth.aws_region,
      config.auth.user_pool_id
    );

    // Create default groups
    const groups = [
      {
        name: "super_admins",
        description: "Super administrators with full system access",
      },
      {
        name: "admins",
        description: "Administrators with limited system access",
      },
      {
        name: "users",
        description: "Regular users with no admin access",
      },
    ];

    console.log("🔄 Creating user groups...\n");

    for (const group of groups) {
      await cognitoAdmin.createGroup(group.name, group.description);
    }

    console.log("\n✅ User groups initialized successfully!");
    console.log("\nAvailable groups:");
    console.log("- super_admins: Full admin panel access");
    console.log("- admins: Limited admin access");
    console.log("- users: Regular user access");
    console.log("\n🎉 You can now create users and assign them to groups!");
  } catch (error: any) {
    console.error("❌ Error initializing groups:", error.message);
    process.exit(1);
  }
}

// Run the script
initializeGroups();
