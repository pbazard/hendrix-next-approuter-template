# Hendrix Admin Setup Guide

## Quick Start

### 1. Deploy Your Backend

```bash
npx amplify sandbox
```

### 2. Initialize User Groups

```bash
npm run init-groups
```

### 3. Create Your First Superuser

```bash
npm run create-superuser
```

### 4. Access Admin Panel

Visit `/admin` and sign in with your superuser credentials.

## Detailed Setup

### Prerequisites

- AWS CLI configured (`aws configure`)
- Amplify backend deployed
- Node.js and npm installed

### Step-by-Step

1. **Deploy Backend**

   ```bash
   npx amplify sandbox
   ```

   This creates your Cognito User Pool and generates `amplify_outputs.json`.

2. **Initialize Groups**

   ```bash
   npm run init-groups
   ```

   Creates the default user groups:
   - `super_admins` - Full admin access
   - `admins` - Limited admin access
   - `users` - Regular users

3. **Create Superuser**

   ```bash
   npm run create-superuser
   ```

   Follow the prompts:
   - Enter admin email
   - Enter secure password
   - Confirm password

4. **Test Access**
   - Visit `http://localhost:3000/admin`
   - Sign in with your superuser credentials
   - You should see the admin dashboard

## Managing Users

### List All Users

```bash
npm run manage-users
# Choose option 1
```

### Add User to Admin Group

```bash
npm run manage-users
# Choose option 3
# Enter user email
# Enter group: super_admins
```

### Create Additional Admins

1. User signs up through the app
2. Run `npm run manage-users`
3. Add them to `admins` or `super_admins` group

## Troubleshooting

### "amplify_outputs.json not found"

- Run `npx amplify sandbox` first
- Make sure the file exists in your project root

### "Access Denied" errors

- Check AWS credentials: `aws sts get-caller-identity`
- Ensure your AWS user has Cognito permissions

### "User already exists"

- Use `npm run manage-users` to add existing users to groups
- Or delete and recreate the user

### Can't sign in to admin

- Verify user is in `super_admins` group
- Check user status is `CONFIRMED`
- Try resetting password through Cognito console

## Production Deployment

### 1. Deploy to Production

```bash
npx amplify deploy --branch main
```

### 2. Update amplify_outputs.json

The deploy command updates your config file with production values.

### 3. Create Production Superuser

```bash
npm run create-superuser
```

### 4. Secure Your Scripts

- Don't commit AWS credentials
- Use IAM roles in production
- Restrict script access to authorized personnel

## Security Best Practices

- **Strong Passwords**: Minimum 8 characters with complexity
- **Regular Audits**: Review user access monthly
- **Principle of Least Privilege**: Only grant necessary permissions
- **Monitor Access**: Check CloudTrail logs for admin activities
- **Backup Strategy**: Regular backups of user data

## Next Steps

- Customize admin permissions in your app
- Add more user groups as needed
- Implement audit logging
- Set up monitoring and alerts
