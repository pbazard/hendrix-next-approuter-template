#!/usr/bin/env tsx

import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import type { Schema } from "../amplify/data/resource";
import outputs from "../amplify_outputs.json";

// Configure Amplify
Amplify.configure(outputs);

const client = generateClient<Schema>();

const sampleUsers = [
  {
    email: "admin@hendrix.com",
    firstName: "Jimi",
    lastName: "Hendrix",
    role: "SUPER_ADMIN" as const,
  },
  {
    email: "user1@hendrix.com",
    firstName: "Eric",
    lastName: "Clapton",
    role: "USER" as const,
  },
  {
    email: "user2@hendrix.com",
    firstName: "Janis",
    lastName: "Joplin",
    role: "USER" as const,
  },
];

const sampleTodos = [
  { content: "Set up the recording studio", isDone: true },
  { content: "Practice guitar solos for upcoming album", isDone: false },
  { content: "Write lyrics for new song", isDone: false },
  { content: "Schedule band rehearsal", isDone: true },
  { content: "Book studio time for next week", isDone: false },
  { content: "Review contract with record label", isDone: true },
  { content: "Plan tour dates for summer", isDone: false },
  { content: "Buy new guitar strings", isDone: false },
  { content: "Meet with sound engineer", isDone: true },
  { content: "Organize music sheets", isDone: false },
];

async function clearData() {
  console.log("[BROOM] Clearing existing users and todos...");

  try {
    const todos = await client.models.Todo.list();
    for (const todo of todos.data) {
      await client.models.Todo.delete({ id: todo.id });
    }

    const users = await client.models.User.list();
    for (const user of users.data) {
      await client.models.User.delete({ id: user.id });
    }

    console.log("[CHECK] Existing data cleared");
  } catch (error) {
    console.log("[WARNING] Some data may not exist yet, continuing...");
  }
}

async function seedUsers() {
  console.log("[USERS] Creating sample users...");

  for (const userData of sampleUsers) {
    try {
      const result = await client.models.User.create({
        ...userData,
        lastLoginAt: new Date().toISOString(),
      });

      if (result.data) {
        console.log(
          `   [CHECK] Created user: ${userData.firstName} ${userData.lastName} (${userData.email})`
        );
      }
    } catch (error) {
      console.error(`   [X] Failed to create user ${userData.email}:`, error);
    }
  }
}

async function seedTodos() {
  console.log("[CLIPBOARD] Creating sample todos...");

  for (const todoData of sampleTodos) {
    try {
      const result = await client.models.Todo.create(todoData);

      if (result.data) {
        console.log(`   [CHECK] Created todo: ${todoData.content}`);
      }
    } catch (error) {
      console.error(`   [X] Failed to create todo:`, error);
    }
  }
}

async function main() {
  console.log("[SEEDLING] Starting simple data seeding (users + todos)...\n");

  try {
    await clearData();
    console.log();

    await seedUsers();
    console.log();

    await seedTodos();
    console.log();

    console.log("[PARTY] Simple data seeding completed!");
    console.log(`   • ${sampleUsers.length} users created`);
    console.log(`   • ${sampleTodos.length} todos created`);
  } catch (error) {
    console.error("[X] Error during seeding:", error);
    process.exit(1);
  }
}

// Run the seeding script
if (require.main === module) {
  main().catch(console.error);
}

export { main as seedSimpleData };
