# GitHub Actions Setup Guide

## Required Repository Secrets

Go to your GitHub repository → Settings → Secrets and variables → Actions

Add these secrets:

### AWS Credentials

```
AWS_ACCESS_KEY_ID=your-access-key-id
AWS_SECRET_ACCESS_KEY=your-secret-access-key
AWS_REGION=eu-west-1  # or your region
```

### How to Get AWS Credentials

#### Option 1: IAM User (Recommended for CI/CD)

1. Go to AWS IAM Console
2. Create new user: `github-actions-user`
3. Attach policies:
   - `AWSCognitoPowerUser` (or custom policy with cognito-idp permissions)
4. Create access key → Store in GitHub secrets

#### Option 2: Temporary Credentials

1. Use AWS STS to generate temporary credentials
2. Update secrets periodically

## Custom IAM Policy (Minimal Permissions)

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
        "cognito-idp:ListUsers",
        "cognito-idp:ListUsersInGroup"
      ],
      "Resource": "arn:aws:cognito-idp:*:*:userpool/YOUR-USER-POOL-ID"
    }
  ]
}
```

## How to Use

### Create Superuser

1. Go to Actions tab in your GitHub repository
2. Select "Create Superuser" workflow
3. Click "Run workflow"
4. Fill in the required fields:
   - Email: admin@yourcompany.com
   - Password: SecurePassword123!
   - First Name: (optional)
   - Last Name: (optional)
5. Click "Run workflow"

### Monitor Progress

- Check the workflow run for real-time logs
- Success/failure notifications in the summary
- Detailed logs for troubleshooting

## Security Best Practices

1. **Use Environment Protection Rules**
   - Require approval for production deployments
   - Limit who can trigger workflows

2. **Rotate Credentials Regularly**
   - Update AWS access keys periodically
   - Use temporary credentials when possible

3. **Audit Workflow Runs**
   - Monitor who runs user creation workflows
   - Keep logs of all user management activities

## Troubleshooting

### Common Issues

- **Invalid credentials**: Check AWS_ACCESS_KEY_ID and AWS_SECRET_ACCESS_KEY
- **Permission denied**: Ensure IAM user has Cognito permissions
- **User already exists**: Check if user exists in Cognito User Pool
- **Invalid password**: Ensure password meets Cognito password policy
