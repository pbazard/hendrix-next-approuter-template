#!/usr/bin/env tsx

import { CognitoAdmin } from "./lib/cognito-admin";
import { loadAmplifyConfig } from "./lib/config";
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";
import { Amplify } from "aws-amplify";

async function syncUsers() {
  console.log("🔄 Syncing Cognito Users with Database");
  console.log("======================================\n");

  try {
    // Load Amplify configuration
    const config = loadAmplifyConfig();

    // Configure Amplify for the script
    Amplify.configure(config);

    const cognitoAdmin = new CognitoAdmin(
      config.auth.aws_region,
      config.auth.user_pool_id
    );

    const client = generateClient<Schema>();

    console.log("🔍 Fetching users from Cognito...");
    const cognitoUsers = await cognitoAdmin.listUsers();

    console.log("🔍 Fetching users from database...");
    const dbUsers = await client.models.User.list();
    const dbUserEmails = new Set(dbUsers.data.map((user) => user.email));

    console.log(`\n📊 Found ${cognitoUsers.length} users in Cognito`);
    console.log(`📊 Found ${dbUsers.data.length} users in database\n`);

    let syncedCount = 0;
    let skippedCount = 0;

    for (const cognitoUser of cognitoUsers) {
      const email = cognitoUser.Attributes?.find(
        (attr) => attr.Name === "email"
      )?.Value;

      if (!email) {
        console.log("⚠️  Skipping user without email");
        skippedCount++;
        continue;
      }

      // Skip if user already exists in database
      if (dbUserEmails.has(email)) {
        console.log(`⏭️  User ${email} already exists in database`);
        skippedCount++;
        continue;
      }

      // Get user groups to determine role
      const groups = await cognitoAdmin.getUserGroups(cognitoUser.Username!);
      let role: "USER" | "ADMIN" | "SUPER_ADMIN" = "USER";

      if (groups.includes("super_admins")) {
        role = "SUPER_ADMIN";
      } else if (groups.includes("admins")) {
        role = "ADMIN";
      }

      // Get user attributes
      const firstName = cognitoUser.Attributes?.find(
        (attr) => attr.Name === "given_name"
      )?.Value;
      const lastName = cognitoUser.Attributes?.find(
        (attr) => attr.Name === "family_name"
      )?.Value;
      const isActive = cognitoUser.UserStatus === "CONFIRMED";

      // Create user in database
      try {
        await client.models.User.create({
          email,
          firstName: firstName || null,
          lastName: lastName || null,
          role,
          isActive,
          lastLoginAt: cognitoUser.UserLastModifiedDate?.toISOString(),
        });

        console.log(`✅ Synced user: ${email} (${role})`);
        syncedCount++;
      } catch (error: any) {
        console.error(`❌ Failed to sync user ${email}:`, error.message);
      }
    }

    console.log(`\n🎉 Sync completed!`);
    console.log(`✅ Synced: ${syncedCount} users`);
    console.log(`⏭️  Skipped: ${skippedCount} users`);
    console.log(
      `📊 Total database users: ${dbUsers.data.length + syncedCount}`
    );
  } catch (error: any) {
    console.error("❌ Error syncing users:", error.message);
    process.exit(1);
  }
}

// Run the script
syncUsers();
