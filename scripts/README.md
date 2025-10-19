# Hendrix Management Scripts

Django-style management commands for your Hendrix application.

## Prerequisites

1. **Deploy your Amplify backend first:**

   ```bash
   npx amplify sandbox
   ```

2. **Ensure AWS credentials are configured:**
   - AWS CLI configured with `aws configure`
   - Or environment variables: `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`
   - Or IAM role if running on AWS

## Available Commands

### Create Superuser

Creates a new superuser with admin privileges:

```bash
npm run create-superuser
```

**What it does:**

- Prompts for email and password
- Creates user in Cognito User Pool
- Adds user to `super_admins` group
- Sets password as permanent (no forced reset)
- Verifies email automatically

**Example:**

```bash
$ npm run create-superuser

🚀 Hendrix Superuser Creation
==============================

Email address: admin@example.com
Password: ********
Password (again): ********

🔄 Creating superuser...
✅ User created: admin@example.com
✅ Password set as permanent for: admin@example.com
✅ Added admin@example.com to group: super_admins

✅ Superuser created successfully!
📧 Email: admin@example.com
👥 Groups: super_admins

🎉 You can now sign in to the admin panel!
```

### Manage Users

Interactive user management interface:

```bash
npm run manage-users
```

**Features:**

- List all users with their groups and status
- Show detailed user information
- Add/remove users from groups
- Delete users
- Create and list groups

**Menu Options:**

1. **List all users** - Shows all users with email, status, groups, and creation date
2. **Show user info** - Detailed information about a specific user
3. **Add user to group** - Add existing user to a group (super_admins, admins, users)
4. **Remove user from group** - Remove user from a group
5. **Delete user** - Permanently delete a user (with confirmation)
6. **List groups** - Show all available groups
7. **Create group** - Create a new user group

## User Groups

The system supports three main user groups:

- **`super_admins`** - Full admin panel access, can manage all data
- **`admins`** - Limited admin access (can be customized)
- **`users`** - Regular users (no admin access)

## Examples

### Creating your first superuser:

```bash
# 1. Deploy backend
npx amplify sandbox

# 2. Create superuser
npm run create-superuser
# Enter: admin@yourcompany.com
# Enter secure password

# 3. Sign in at /admin
```

### Managing existing users:

```bash
npm run manage-users

# Choose option 1 to see all users
# Choose option 3 to promote a user to admin
# Choose option 2 to see user details
```

### Adding a regular admin:

```bash
npm run manage-users
# Choose option 3: Add user to group
# Enter user email
# Enter group: admins
```

## Troubleshooting

### "Failed to load amplify_outputs.json"

- Make sure you've deployed your backend: `npx amplify sandbox`
- Check that `amplify_outputs.json` exists in your project root

### "Access Denied" or AWS credential errors

- Configure AWS CLI: `aws configure`
- Or set environment variables:
  ```bash
  export AWS_ACCESS_KEY_ID=your_key
  export AWS_SECRET_ACCESS_KEY=your_secret
  export AWS_REGION=us-east-1
  ```

### "Group does not exist"

- Groups are created automatically when first used
- Or create manually using the manage-users script

### "User already exists"

- The create-superuser script will offer to add existing users to super_admins group
- Use manage-users to modify existing users

## Security Notes

- **Superusers have full access** to all admin functions
- **Store credentials securely** - don't commit passwords to git
- **Use strong passwords** - minimum 8 characters with complexity
- **Regular audits** - periodically review user access with `npm run manage-users`
- **Principle of least privilege** - only grant admin access when necessary

## Integration with Your App

The management scripts work with your existing authentication system:

1. **Users created here** can sign in through your app's login form
2. **Group membership** is automatically checked by your admin layout
3. **No additional setup** required - works with existing Cognito configuration

## Advanced Usage

### Batch Operations

You can extend the scripts for batch operations by modifying the TypeScript files in `scripts/lib/`.

### Custom Groups

Create custom groups with specific permissions by:

1. Using `npm run manage-users` → option 7
2. Updating your app's authorization logic
3. Adding group checks in your admin components

### Automation

The scripts can be integrated into CI/CD pipelines:

```bash
# In your deployment script
npm run create-superuser < superuser_input.txt
```
