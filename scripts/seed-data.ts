#!/usr/bin/env tsx

import { generateClient } from "aws-amplify/data";
import { Amplify } from "aws-amplify";
import type { Schema } from "../amplify/data/resource";
import outputs from "../amplify_outputs.json";

// Configure Amplify
Amplify.configure(outputs);

const client = generateClient<Schema>();

interface SeedUser {
  email: string;
  firstName: string;
  lastName: string;
  role: "USER" | "ADMIN" | "SUPER_ADMIN";
}

interface SeedTodo {
  content: string;
  isDone: boolean;
}

interface SeedPost {
  title: string;
  content: string;
  excerpt: string;
  status: "DRAFT" | "PUBLISHED" | "ARCHIVED";
  publishedAt?: string;
}

interface SeedCategory {
  name: string;
  slug: string;
  description: string;
}

interface SeedTag {
  name: string;
  slug: string;
  color: string;
}

const sampleUsers: SeedUser[] = [
  {
    email: "admin@hendrix.com",
    firstName: "Jimi",
    lastName: "Hendrix",
    role: "SUPER_ADMIN",
  },
  {
    email: "editor@hendrix.com",
    firstName: "Noel",
    lastName: "Redding",
    role: "ADMIN",
  },
  {
    email: "writer@hendrix.com",
    firstName: "Mitch",
    lastName: "Mitchell",
    role: "USER",
  },
  {
    email: "user1@hendrix.com",
    firstName: "Eric",
    lastName: "Clapton",
    role: "USER",
  },
  {
    email: "user2@hendrix.com",
    firstName: "Janis",
    lastName: "Joplin",
    role: "USER",
  },
];

const sampleTodos: SeedTodo[] = [
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

const sampleCategories: SeedCategory[] = [
  {
    name: "Music",
    slug: "music",
    description: "All things related to music and sound",
  },
  {
    name: "Technology",
    slug: "technology",
    description: "Tech news and innovations",
  },
  {
    name: "Culture",
    slug: "culture",
    description: "Cultural insights and commentary",
  },
  {
    name: "History",
    slug: "history",
    description: "Historical perspectives and stories",
  },
];

const sampleTags: SeedTag[] = [
  { name: "Rock", slug: "rock", color: "#FF6B6B" },
  { name: "Blues", slug: "blues", color: "#4ECDC4" },
  { name: "Psychedelic", slug: "psychedelic", color: "#45B7D1" },
  { name: "Guitar", slug: "guitar", color: "#96CEB4" },
  { name: "Vintage", slug: "vintage", color: "#FFEAA7" },
  { name: "Studio", slug: "studio", color: "#DDA0DD" },
];

const samplePosts: SeedPost[] = [
  {
    title: "The Evolution of Electric Guitar",
    content:
      "The electric guitar revolutionized music in the 20th century. From its humble beginnings in the 1930s to the psychedelic sounds of the 1960s, this instrument has shaped countless genres and inspired generations of musicians.",
    excerpt: "Exploring how the electric guitar changed music forever",
    status: "PUBLISHED",
    publishedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Recording Techniques of the 60s",
    content:
      "The 1960s brought revolutionary recording techniques that are still used today. Multi-tracking, reverb chambers, and innovative microphone placement created the signature sounds of the era.",
    excerpt: "Classic recording methods that defined an era",
    status: "PUBLISHED",
    publishedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "The Woodstock Experience",
    content:
      "Woodstock wasn't just a music festival; it was a cultural phenomenon that defined a generation. The three days of peace, love, and music brought together hundreds of thousands of people in a celebration of counterculture.",
    excerpt: "How Woodstock became more than just a music festival",
    status: "PUBLISHED",
    publishedAt: new Date(Date.now() - 21 * 24 * 60 * 60 * 1000).toISOString(),
  },
  {
    title: "Modern Guitar Effects",
    content:
      "From analog pedals to digital processors, guitar effects have evolved dramatically. This post explores the technology behind the sounds that shape modern music.",
    excerpt: "The technology behind guitar effects",
    status: "DRAFT",
  },
  {
    title: "Blues Influence on Rock",
    content:
      "The blues laid the foundation for rock music. Understanding this connection helps us appreciate the roots of modern popular music and the artists who bridged these genres.",
    excerpt: "Tracing rock music back to its blues origins",
    status: "PUBLISHED",
    publishedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

async function clearExistingData() {
  console.log("[BROOM] Clearing existing data...");

  try {
    // Clear in reverse dependency order
    const postTags = await client.models.PostTag.list();
    for (const item of postTags.data) {
      await client.models.PostTag.delete({ id: item.id });
    }

    const postCategories = await client.models.PostCategory.list();
    for (const item of postCategories.data) {
      await client.models.PostCategory.delete({ id: item.id });
    }

    const posts = await client.models.Post.list();
    for (const post of posts.data) {
      await client.models.Post.delete({ id: post.id });
    }

    const todos = await client.models.Todo.list();
    for (const todo of todos.data) {
      await client.models.Todo.delete({ id: todo.id });
    }

    const tags = await client.models.Tag.list();
    for (const tag of tags.data) {
      await client.models.Tag.delete({ id: tag.id });
    }

    const categories = await client.models.Category.list();
    for (const category of categories.data) {
      await client.models.Category.delete({ id: category.id });
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
  const createdUsers = [];

  for (const userData of sampleUsers) {
    try {
      const result = await client.models.User.create({
        ...userData,
        lastLoginAt: new Date().toISOString(),
      });

      if (result.data) {
        createdUsers.push(result.data);
        console.log(
          `   [CHECK] Created user: ${userData.firstName} ${userData.lastName} (${userData.email})`
        );
      }
    } catch (error) {
      console.error(`   [X] Failed to create user ${userData.email}:`, error);
    }
  }

  return createdUsers;
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

async function seedCategories() {
  console.log("[FOLDER] Creating sample categories...");
  const createdCategories = [];

  for (const categoryData of sampleCategories) {
    try {
      const result = await client.models.Category.create(categoryData);

      if (result.data) {
        createdCategories.push(result.data);
        console.log(`   [CHECK] Created category: ${categoryData.name}`);
      }
    } catch (error) {
      console.error(
        `   [X] Failed to create category ${categoryData.name}:`,
        error
      );
    }
  }

  return createdCategories;
}

async function seedTags() {
  console.log("[TAG] Creating sample tags...");
  const createdTags = [];

  for (const tagData of sampleTags) {
    try {
      const result = await client.models.Tag.create(tagData);

      if (result.data) {
        createdTags.push(result.data);
        console.log(`   [CHECK] Created tag: ${tagData.name}`);
      }
    } catch (error) {
      console.error(`   [X] Failed to create tag ${tagData.name}:`, error);
    }
  }

  return createdTags;
}

async function seedPosts(users: any[], categories: any[], tags: any[]) {
  console.log("[FILE_TEXT] Creating sample posts...");
  const createdPosts = [];

  for (let i = 0; i < samplePosts.length; i++) {
    const postData = samplePosts[i];
    const author = users[i % users.length]; // Cycle through users

    try {
      const result = await client.models.Post.create({
        ...postData,
        authorId: author.id,
      });

      if (result.data) {
        createdPosts.push(result.data);
        console.log(`   [CHECK] Created post: ${postData.title}`);

        // Add random categories and tags
        const randomCategories = categories
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 2) + 1);
        const randomTags = tags
          .sort(() => 0.5 - Math.random())
          .slice(0, Math.floor(Math.random() * 3) + 1);

        // Create post-category relationships
        for (const category of randomCategories) {
          await client.models.PostCategory.create({
            postId: result.data.id,
            categoryId: category.id,
          });
        }

        // Create post-tag relationships
        for (const tag of randomTags) {
          await client.models.PostTag.create({
            postId: result.data.id,
            tagId: tag.id,
          });
        }
      }
    } catch (error) {
      console.error(`   [X] Failed to create post ${postData.title}:`, error);
    }
  }

  return createdPosts;
}

async function seedSettings() {
  console.log("[SETTINGS] Creating sample settings...");

  const settings = [
    {
      key: "site_title",
      value: "Hendrix CMS",
      type: "STRING" as const,
      description: "The main title of the website",
      isPublic: true,
    },
    {
      key: "posts_per_page",
      value: "10",
      type: "NUMBER" as const,
      description: "Number of posts to display per page",
      isPublic: true,
    },
    {
      key: "enable_comments",
      value: "true",
      type: "BOOLEAN" as const,
      description: "Whether to enable comments on posts",
      isPublic: false,
    },
    {
      key: "theme_config",
      value: JSON.stringify({
        primaryColor: "#8B5CF6",
        secondaryColor: "#06B6D4",
        darkMode: true,
      }),
      type: "JSON" as const,
      description: "Theme configuration settings",
      isPublic: false,
    },
  ];

  for (const settingData of settings) {
    try {
      const result = await client.models.Setting.create(settingData);

      if (result.data) {
        console.log(`   [CHECK] Created setting: ${settingData.key}`);
      }
    } catch (error) {
      console.error(
        `   [X] Failed to create setting ${settingData.key}:`,
        error
      );
    }
  }
}

async function main() {
  console.log("[SEEDLING] Starting data seeding process...\n");

  try {
    await clearExistingData();
    console.log();

    const users = await seedUsers();
    console.log();

    await seedTodos();
    console.log();

    const categories = await seedCategories();
    console.log();

    const tags = await seedTags();
    console.log();

    const posts = await seedPosts(users, categories, tags);
    console.log();

    await seedSettings();
    console.log();

    console.log("[PARTY] Data seeding completed successfully!");
    console.log(`   • ${users.length} users created`);
    console.log(`   • ${sampleTodos.length} todos created`);
    console.log(`   • ${categories.length} categories created`);
    console.log(`   • ${tags.length} tags created`);
    console.log(`   • ${posts.length} posts created`);
    console.log(`   • 4 settings created`);
  } catch (error) {
    console.error("[X] Error during seeding:", error);
    process.exit(1);
  }
}

// Run the seeding script
if (require.main === module) {
  main().catch(console.error);
}

export { main as seedData };
