# Amplify Lambda Functions

## Create Superuser Functions

This directory contains Lambda functions for creating superusers in your Amplify application.

### Functions

1. **create-superuser** - Direct Lambda function for internal use
2. **create-superuser-api** - REST API endpoint for external access

### Deployment

These functions are automatically deployed when you run:

```bash
npx ampx sandbox
# or
npx ampx sandbox --once
```

### Usage

#### Option 1: Direct Lambda Invocation

```bash
# Using AWS CLI
aws lambda invoke \
  --function-name "amplify-[your-app-name]-[branch]-createSuperuser" \
  --payload '{"email":"admin@example.com","password":"SecurePass123!","firstName":"Admin","lastName":"User"}' \
  response.json

# Check the response
cat response.json
```

#### Option 2: REST API Endpoint

After deployment, you'll get an API Gateway endpoint. Use it like this:

```bash
# Get the API endpoint from amplify_outputs.json or AWS Console
curl -X POST https://your-api-id.execute-api.region.amazonaws.com/prod/create-superuser \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "SecurePass123!",
    "firstName": "Admin",
    "lastName": "User",
    "secretKey": "your-secret-key-here"
  }'
```

#### Option 3: From Your Application

```typescript
// In your React app
const createSuperuser = async (userData: {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}) => {
  const response = await fetch("/api/create-superuser", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      ...userData,
      secretKey: process.env.NEXT_PUBLIC_ADMIN_SECRET_KEY,
    }),
  });

  return response.json();
};
```

### Environment Variables

The functions automatically receive:

- `AMPLIFY_AUTH_USERPOOL_ID` - Your Cognito User Pool ID
- `AWS_REGION` - The AWS region
- `ADMIN_SECRET_KEY` - Secret key for API authentication (API function only)

### Security

- Functions have minimal IAM permissions (only Cognito user management)
- API endpoint requires a secret key for authentication
- All functions log activities to CloudWatch

### Monitoring

Check CloudWatch logs for function execution:

1. Go to AWS CloudWatch Console
2. Navigate to Log Groups
3. Find `/aws/lambda/amplify-[your-app]-[branch]-createSuperuser`

### Troubleshooting

Common issues:

- **Permission denied**: Check IAM roles and policies
- **User Pool not found**: Verify AMPLIFY_AUTH_USERPOOL_ID environment variable
- **Invalid password**: Ensure password meets Cognito password policy
- **User already exists**: Check if user exists in Cognito User Pool

### Development

To modify the functions:

1. Edit the handler files
2. Run `npx ampx sandbox` to redeploy
3. Test using the methods above
