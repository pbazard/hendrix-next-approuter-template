import { type ClientSchema, a, defineData } from "@aws-amplify/backend";

const schema = a.schema({
  // User management
  User: a
    .model({
      email: a.string().required(),
      firstName: a.string(),
      lastName: a.string(),
      role: a.enum(["USER", "ADMIN", "SUPER_ADMIN"]),
      isActive: a.boolean().default(true),
      lastLoginAt: a.datetime(),
      posts: a.hasMany("Post", "authorId"),
    })
    .authorization((allow) => [
      allow.publicApiKey(),
      allow.owner(),
      allow.groups(["admins", "super_admins"]),
    ]),

  // Content management
  Post: a
    .model({
      title: a.string().required(),
      content: a.string(),
      excerpt: a.string(),
      status: a.enum(["DRAFT", "PUBLISHED", "ARCHIVED"]),
      publishedAt: a.datetime(),
      authorId: a.id(),
      author: a.belongsTo("User", "authorId"),
      tags: a.hasMany("PostTag", "postId"),
      categories: a.hasMany("PostCategory", "postId"),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.owner(),
      allow.groups(["admins", "super_admins"]),
    ]),

  // Category management
  Category: a
    .model({
      name: a.string().required(),
      slug: a.string().required(),
      description: a.string(),
      parentId: a.id(),
      parent: a.belongsTo("Category", "parentId"),
      children: a.hasMany("Category", "parentId"),
      posts: a.hasMany("PostCategory", "categoryId"),
      isActive: a.boolean().default(true),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["admins", "super_admins"]),
    ]),

  // Tag management
  Tag: a
    .model({
      name: a.string().required(),
      slug: a.string().required(),
      color: a.string(),
      posts: a.hasMany("PostTag", "tagId"),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["admins", "super_admins"]),
    ]),

  // Many-to-many relationships
  PostTag: a
    .model({
      postId: a.id().required(),
      tagId: a.id().required(),
      post: a.belongsTo("Post", "postId"),
      tag: a.belongsTo("Tag", "tagId"),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["admins", "super_admins"]),
    ]),

  PostCategory: a
    .model({
      postId: a.id().required(),
      categoryId: a.id().required(),
      post: a.belongsTo("Post", "postId"),
      category: a.belongsTo("Category", "categoryId"),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["admins", "super_admins"]),
    ]),

  // Settings management
  Setting: a
    .model({
      key: a.string().required(),
      value: a.string(),
      type: a.enum(["STRING", "NUMBER", "BOOLEAN", "JSON"]),
      description: a.string(),
      isPublic: a.boolean().default(false),
    })
    .authorization((allow) => [
      allow.publicApiKey().to(["read"]),
      allow.groups(["super_admins"]),
    ]),

  // Legacy Todo model for backward compatibility
  Todo: a
    .model({
      content: a.string(),
      isDone: a.boolean().default(false),
    })
    .authorization((allow) => [allow.publicApiKey()]),
});

export type Schema = ClientSchema<typeof schema>;

export const data = defineData({
  schema,
  authorizationModes: {
    defaultAuthorizationMode: "apiKey",
    apiKeyAuthorizationMode: {
      expiresInDays: 30,
    },
  },
});

/*== STEP 2 ===============================================================
Go to your frontend source code. From your client-side code, generate a
Data client to make CRUDL requests to your table. (THIS SNIPPET WILL ONLY
WORK IN THE FRONTEND CODE FILE.)

Using JavaScript or Next.js React Server Components, Middleware, Server 
Actions or Pages Router? Review how to generate Data clients for those use
cases: https://docs.amplify.aws/gen2/build-a-backend/data/connect-to-API/
=========================================================================*/

/*
"use client"
import { generateClient } from "aws-amplify/data";
import type { Schema } from "@/amplify/data/resource";

const client = generateClient<Schema>() // use this Data client for CRUDL requests
*/

/*== STEP 3 ===============================================================
Fetch records from the database and use them in your frontend component.
(THIS SNIPPET WILL ONLY WORK IN THE FRONTEND CODE FILE.)
=========================================================================*/

/* For example, in a React component, you can use this snippet in your
  function's RETURN statement */
// const { data: todos } = await client.models.Todo.list()

// return <ul>{todos.map(todo => <li key={todo.id}>{todo.content}</li>)}</ul>
