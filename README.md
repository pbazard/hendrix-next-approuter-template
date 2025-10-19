# Hendrix - Modern Web Application

A comprehensive web application built with Next.js 15, Tailwind CSS 4, and AWS Amplify Gen2, featuring a complete admin system with authentication, CRUD operations, and user management.

## 🚀 Features

- **Modern Stack**: Next.js 15 (App Router), Tailwind CSS 4, TypeScript
- **Authentication**: Amazon Cognito with role-based access control
- **Admin System**: Complete admin interface with CRUD operations
- **Database**: Real-time GraphQL API with AWS AppSync and DynamoDB
- **UI Components**: shadcn/ui components with Lucide React icons
- **Theme System**: Light/dark mode with next-themes
- **Toast Notifications**: User feedback with react-hot-toast
- **Lambda Functions**: Serverless user management functions
- **CI/CD Ready**: GitHub Actions workflows for deployment

## 📋 Table of Contents

- [Quick Start](#quick-start)
- [Admin System Setup](#admin-system-setup)
- [Scripts & User Management](#scripts--user-management)
- [Lambda Functions](#lambda-functions)
- [GitHub Actions](#github-actions)
- [Data Models](#data-models)
- [Development](#development)
- [Deployment](#deployment)
- [Troubleshooting](#troubleshooting)

## 🏃‍♂️ Quick Start

### Prerequisites

- Node.js 18+ and npm
- AWS CLI configured (`aws configure`)
- Git

### Installation

```bash
# Clone the repository
git clone <your-repo-url>
cd hendrix-app

# Install dependencies
npm install

# Deploy Amplify backend
npx ampx sandbox

# Initialize user groups
npm run init-groups

# Create your first superuser
npm run create-superuser

# Start development server
npm run dev
```

Visit `http://localhost:3000` to see the app and `http://localhost:3000/admin` for the admin panel.

## 🔐 Admin System Setup

### 1. Deploy Backend

```bash
npx ampx sandbox
```

This creates your Cognito User Pool and generates `amplify_outputs.json`.

### 2. Initialize User Groups

```bash
npm run init-groups
```

Creates default user groups:

- `super_admins` - Full admin access
- `admins` - Limited admin access
- `users` - Regular users

### 3. Create Superuser

```bash
npm run create-superuser
```

Follow the prompts to create your first admin user.

### 4. Access Admin Panel

Visit `/admin` and sign in with your superuser credentials.

## 📜 Scripts & User Management

### Available Scripts

```bash
# Data seeding
npm run seed-simple      # Create sample users and todos
npm run seed            # Create comprehensive sample data

# User management
npm run create-superuser # Create new super admin
npm run manage-users    # Interactive user management
npm run debug-user      # Debug user information
npm run init-groups     # Initialize Cognito groups

# Development
npm run dev            # Start development server
npm run build          # Build for production
npm run lint           # Run ESLint
```

### User Management Features

**Interactive Management:**

```bash
npm run manage-users
```

Options:

1. List all users
2. Show user details
3. Add user to group
4. Remove user from group
5. Delete user

**Debug User Issues:**

```bash
npm run debug-user
# Enter email to check:
# - User existence and status
# - Group memberships
# - Email verification
```

## ⚡ Lambda Functions

### Automatic Deployment

Lambda functions are deployed automatically with your Amplify backend:

```bash
npx ampx sandbox  # Deploys functions + infrastructure
```

### Available Functions

1. **create-superuser** - Direct Lambda function for AWS CLI/SDK invocation
2. **create-superuser-api** - REST API endpoint for HTTP requests

**Important:** Use the correct function for your use case:

- For AWS CLI: Use `create-superuser` (direct Lambda)
- For HTTP requests: Use `create-superuser-api` (API Gateway)

### Usage Options

#### AWS CLI (Direct Lambda)

**Option 1: Using file payload (recommended)**

```bash
# First, find your actual function name
aws lambda list-functions --query 'Functions[?contains(FunctionName, `createSuperuser`)].FunctionName' --output text

# Create payload file
echo '{"email":"admin@example.com","password":"SecurePass123!","firstName":"Admin","lastName":"User"}' > payload.json

# Invoke function (replace with your actual function name)
aws lambda invoke \
  --function-name "amplify-yourapp-sandbox-createSuperuser" \
  --payload file://payload.json \
  response.json

# Check response
cat response.json
```

**Option 2: Using base64 encoded payload**

```bash
# Replace with your actual function name
aws lambda invoke \
  --function-name "amplify-yourapp-sandbox-createSuperuser" \
  --payload $(echo '{"email":"admin@example.com","password":"SecurePass123!"}' | base64) \
  response.json
```

#### REST API Endpoint

```bash
curl -X POST https://[api-id].execute-api.[region].amazonaws.com/prod/create-superuser \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "secretKey": "your-secret-key-here"
  }'
```

#### From Your Application

```typescript
const createSuperuser = async (userData) => {
  const response = await fetch("/api/create-superuser", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...userData,
      secretKey: process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY,
    }),
  });
  return response.json();
};
```

## 🔄 GitHub Actions

### Setup Repository Secrets

Go to GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

```
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=eu-west-1
```

### Available Workflows

#### Create Superuser Workflow

1. Go to Actions tab
2. Select "Create Superuser" workflow
3. Click "Run workflow"
4. Fill in user details
5. Monitor execution

#### User Management Workflow

- Multiple user management actions
- Form-based input
- Audit trail of operations

### IAM Policy for GitHub Actions

```json
{
  "Version": "2012-10-17",
  "Statement": [
    {
      "Effect": "Allow",
      "Action": [
        "cognito-idp:AdminCreateUser",
        "cognito-idp:AdminSetUserPassword",
        "cognito-idp:AdminAddUserToGroup",
        "cognito-idp:AdminGetUser",
        "cognito-idp:ListUsers"
      ],
      "Resource": "arn:aws:cognito-idp:*:*:userpool/YOUR-USER-POOL-ID"
    }
  ]
}
```

## 🗄️ Data Models

### Core Models

- **User** - User accounts with roles and authentication
- **Post** - Content management with categories and tags
- **Category** - Hierarchical content organization
- **Tag** - Content labeling system
- **Todo** - Simple task management
- **Setting** - Application configuration

### Relationships

- Users → Posts (one-to-many)
- Posts ↔ Categories (many-to-many via PostCategory)
- Posts ↔ Tags (many-to-many via PostTag)
- Categories → Categories (self-referencing for hierarchy)

### Authorization

- **Public API Key**: Read access for public content
- **User Groups**: Admin operations require group membership
- **Owner-based**: Users can manage their own content

## 🛠️ Development

### Project Structure

```
src/
├── app/
│   ├── admin/           # Admin interface
│   ├── components/      # Shared components
│   ├── hooks/          # Custom React hooks
│   └── profile/        # User profile page
├── components/ui/       # shadcn/ui components
amplify/
├── auth/               # Cognito configuration
├── data/               # GraphQL schema
├── functions/          # Lambda functions
└── backend.ts          # Backend configuration
scripts/                # Management scripts
```

### Key Components

- **AuthProvider** - Authentication context and user management
- **ThemeProvider** - Light/dark mode theming
- **CrudTable** - Generic CRUD interface for admin
- **ConditionalLayout** - Layout switching based on routes

### Development Commands

```bash
npm run dev            # Start development server
npm run build          # Build for production
npm run lint           # Run linting
npm run seed-simple    # Seed basic data
npm run seed          # Seed comprehensive data
```

## 🚀 Deployment

### Development (Sandbox)

```bash
npx ampx sandbox       # Deploy to sandbox environment
```

### Production

```bash
npx ampx deploy --branch main  # Deploy to production
```

### Environment Variables

The app automatically configures itself using `amplify_outputs.json` generated during deployment.

## 🔧 Troubleshooting

### Common Issues

#### "Access Denied" in Admin Panel

**Check user groups:**

```bash
npm run debug-user
# Enter your email to verify group membership
```

**Add user to admin group:**

```bash
npm run manage-users
# Choose option 3: Add user to group
# Enter email and group: super_admins
```

#### "Amplify has not been configured"

**Deploy backend:**

```bash
npx ampx sandbox
# Ensure amplify_outputs.json is generated
```

#### User Can't Sign In

**Check user status:**

```bash
npm run debug-user
# Verify user status is CONFIRMED
```

**Recreate user if needed:**

```bash
npm run manage-users
# Delete user, then run create-superuser again
```

#### CRUD Operations Not Working

**Check console logs:**

- Open browser dev tools
- Look for `[CRUD]` prefixed logs
- Check for authorization errors

**Verify data permissions:**

- Ensure user is in correct groups
- Check GraphQL schema authorization rules

### Debug Steps

1. **Verify Backend**: Check `amplify_outputs.json` exists
2. **Check User**: Run `npm run debug-user`
3. **Test Authentication**: Try signing in/out
4. **Check Console**: Look for error messages in browser
5. **Verify Groups**: Ensure user has correct group membership

### Getting Help

If issues persist:

1. Run `npm run debug-user` and share output
2. Check browser console for errors
3. Verify AWS credentials: `aws sts get-caller-identity`
4. Ensure backend is deployed: `npx ampx sandbox`

## 📄 License

This project is licensed under the MIT-0 License. See the LICENSE file for details.

## 🤝 Contributing

See [CONTRIBUTING.md](CONTRIBUTING.md) for contribution guidelines.

## 📞 Support

For issues and questions:

- Check the troubleshooting section above
- Review browser console logs
- Verify AWS configuration and permissions
