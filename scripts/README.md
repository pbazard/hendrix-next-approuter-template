# Scripts Documentation

This directory contains various utility scripts for managing the Hendrix CMS application.

## Data Seeding Scripts

### `seed-simple.ts`

Creates basic sample data with users and todos only.

**Usage:**

```bash
npm run seed-simple
```

**Creates:**

- 3 sample users (Jimi Hendrix as super admin, Eric Clapton and Janis Joplin as regular users)
- 10 sample todos with various completion states

### `seed-data.ts`

Creates comprehensive sample data including all models.

**Usage:**

```bash
npm run seed
```

**Creates:**

- 5 sample users with different roles
- 10 sample todos
- 4 categories (Music, Technology, Culture, History)
- 6 tags with colors (Rock, Blues, Psychedelic, Guitar, Vintage, Studio)
- 5 sample posts with relationships to users, categories, and tags
- 4 system settings

## User Management Scripts

### `create-superuser.ts`

Creates a new super admin user in Cognito and the database.

**Usage:**

```bash
npm run create-superuser
```

### `manage-users.ts`

Interactive script for managing users (list, create, delete, change roles).

**Usage:**

```bash
npm run manage-users
```

### `init-groups.ts`

Initializes Cognito user groups (admins, super_admins).

**Usage:**

```bash
npm run init-groups
```

### `debug-user.ts`

Debug utility for checking user information and group memberships.

**Usage:**

```bash
npm run debug-user
```

## Prerequisites

Before running any scripts, ensure:

1. Your Amplify backend is deployed
2. You have valid AWS credentials configured
3. The `amplify_outputs.json` file exists in the project root

## Notes

- All seeding scripts will clear existing data before creating new records
- User management scripts require appropriate AWS permissions
- The scripts use the same data client configuration as your frontend application
