# Admin Access Troubleshooting Guide

## Quick Diagnosis

### Step 1: Debug Your User

```bash
npm run debug-user
# Enter your admin email when prompted
```

This will show you:

- ✅ If the user exists in Cognito
- ✅ User status (should be CONFIRMED)
- ✅ Groups assigned (should include super_admins)
- ✅ Email verification status

### Step 2: Check Browser Console

1. Open `/admin` in your browser
2. Open Developer Tools (F12)
3. Look for console logs starting with 🔍
4. Check for any error messages

## Common Issues & Solutions

### Issue 1: User Not in super_admins Group

**Symptoms:**

- User can sign in but gets "Access Denied"
- Debug shows user has no groups or wrong groups

**Solution:**

```bash
npm run manage-users
# Choose option 3: Add user to group
# Enter user email
# Enter group: super_admins
```

### Issue 2: User Status Not CONFIRMED

**Symptoms:**

- Cannot sign in at all
- Debug shows status as FORCE_CHANGE_PASSWORD or UNCONFIRMED

**Solution:**

```bash
npm run manage-users
# Choose option 2: Show user info
# If status is not CONFIRMED, delete and recreate:
# Choose option 5: Delete user
# Then run: npm run create-superuser
```

### Issue 3: Groups Not Loading in App

**Symptoms:**

- Debug script shows user has super_admins group
- But browser console shows empty groups array

**Check Console Logs:**
Look for these debug messages in browser console:

```
🔍 User attributes: {...}
🔍 Groups from cognito:groups: [...]
🎯 Final groups array: [...]
```

**If groups array is empty:**

1. The groups might not be in the JWT token
2. Try signing out and back in
3. Check if you need to refresh the user pool configuration

### Issue 4: Email Not Verified

**Symptoms:**

- Cannot sign in
- Debug shows email_verified: false

**Solution:**

```bash
npm run manage-users
# Choose option 2: Show user info
# If email not verified, recreate user:
npm run create-superuser
```

### Issue 5: Wrong Password

**Symptoms:**

- Sign in form shows "Incorrect username or password"

**Solution:**

1. Try the password you used when creating the superuser
2. If forgotten, delete and recreate:

```bash
npm run manage-users
# Choose option 5: Delete user
npm run create-superuser
```

### Issue 6: Amplify Not Configured

**Symptoms:**

- Console shows "Amplify has not been configured"
- Cannot sign in at all

**Solution:**

```bash
# Make sure backend is deployed
npx amplify sandbox

# Check that amplify_outputs.json exists
ls amplify_outputs.json
```

## Step-by-Step Debugging

### 1. Verify Backend Setup

```bash
# Check if backend is deployed
ls amplify_outputs.json

# If missing, deploy:
npx amplify sandbox
```

### 2. Check User in Cognito

```bash
npm run debug-user
# Enter your admin email
```

Expected output:

```
👤 User Information:
📧 Email: admin@example.com
👤 Username: admin@example.com
📊 Status: CONFIRMED
📅 Created: 12/19/2024

👥 Groups (1):
✅ super_admins
   🎯 This user should have admin access
```

### 3. Test Sign In Process

1. Go to `/admin`
2. Try signing in
3. Check browser console for debug logs
4. Look for authentication errors

### 4. Check Group Detection

In browser console, you should see:

```
🔍 User attributes: {email: "admin@example.com", ...}
✅ Groups from cognito:groups: ["super_admins"]
🎯 Final groups array: ["super_admins"]
🔍 Admin Layout Debug:
- User: {username: "admin@example.com", groups: ["super_admins"]}
- isSuperAdmin: true
```

## Manual Fixes

### Recreate User Completely

```bash
# 1. Delete existing user
npm run manage-users
# Choose option 5, enter email

# 2. Create fresh superuser
npm run create-superuser
# Enter same email and new password

# 3. Verify creation
npm run debug-user
# Should show CONFIRMED status and super_admins group
```

### Reset User Groups

```bash
npm run manage-users
# Choose option 4: Remove user from group
# Enter email and group name to remove

# Then add back:
# Choose option 3: Add user to group
# Enter email and super_admins
```

### Check AWS Credentials

```bash
# Verify AWS access
aws sts get-caller-identity

# Should show your AWS account info
# If error, run: aws configure
```

## Still Having Issues?

### Enable More Debug Logging

The app now includes extensive debug logging. Check your browser console for:

- 🔍 User attributes
- ✅ Group detection methods
- 🎯 Final group assignments
- 🔍 Admin layout decisions

### Common Error Messages

**"Access Denied"**

- User not in super_admins group
- Run: `npm run debug-user` to check

**"Please sign in with your admin credentials"**

- User not authenticated
- Try signing in again

**"Amplify has not been configured"**

- Backend not deployed
- Run: `npx amplify sandbox`

**"User does not exist"**

- User not created in Cognito
- Run: `npm run create-superuser`

### Contact Support

If none of these solutions work:

1. Run `npm run debug-user` and share the output
2. Share browser console logs from `/admin` page
3. Confirm your Amplify backend is deployed
4. Verify AWS credentials are working
