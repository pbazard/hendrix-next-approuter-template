import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminSetUserPasswordCommand,
  AdminAddUserToGroupCommand,
} from "@aws-sdk/client-cognito-identity-provider";

const cognitoClient = new CognitoIdentityProviderClient({
  region: process.env.AWS_REGION,
});

interface CreateSuperuserEvent {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export const handler = async (event: CreateSuperuserEvent) => {
  try {
    const { email, password, firstName, lastName } = event;

    if (!email || !password) {
      throw new Error("Email and password are required");
    }

    const userPoolId = process.env.AMPLIFY_AUTH_USERPOOL_ID;

    if (!userPoolId) {
      throw new Error("User Pool ID not found in environment variables");
    }

    console.log(`Creating superuser: ${email}`);

    // Create user
    const createUserCommand = new AdminCreateUserCommand({
      UserPoolId: userPoolId,
      Username: email,
      UserAttributes: [
        { Name: "email", Value: email },
        { Name: "email_verified", Value: "true" },
        ...(firstName ? [{ Name: "given_name", Value: firstName }] : []),
        ...(lastName ? [{ Name: "family_name", Value: lastName }] : []),
      ],
      MessageAction: "SUPPRESS", // Don't send welcome email
      TemporaryPassword: password,
    });

    await cognitoClient.send(createUserCommand);
    console.log(`User created: ${email}`);

    // Set permanent password
    const setPasswordCommand = new AdminSetUserPasswordCommand({
      UserPoolId: userPoolId,
      Username: email,
      Password: password,
      Permanent: true,
    });

    await cognitoClient.send(setPasswordCommand);
    console.log(`Password set as permanent for: ${email}`);

    // Add to super_admins group
    const addToGroupCommand = new AdminAddUserToGroupCommand({
      UserPoolId: userPoolId,
      Username: email,
      GroupName: "super_admins",
    });

    await cognitoClient.send(addToGroupCommand);
    console.log(`Added ${email} to group: super_admins`);

    return {
      message: "Superuser created successfully",
      email: email,
      groups: ["super_admins"],
    };
  } catch (error) {
    console.error("Error creating superuser:", error);
    throw error;
  }
};
