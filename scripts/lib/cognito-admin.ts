import {
  CognitoIdentityProviderClient,
  AdminCreateUserCommand,
  AdminAddUserToGroupCommand,
  AdminRemoveUserFromGroupCommand,
  AdminListGroupsForUserCommand,
  AdminGetUserCommand,
  AdminSetUserPasswordCommand,
  AdminUpdateUserAttributesCommand,
  ListUsersCommand,
  CreateGroupCommand,
  ListGroupsCommand,
  AdminDeleteUserCommand,
} from "@aws-sdk/client-cognito-identity-provider";

export class CognitoAdmin {
  private client: CognitoIdentityProviderClient;
  private userPoolId: string;

  constructor(region: string, userPoolId: string) {
    this.client = new CognitoIdentityProviderClient({ region });
    this.userPoolId = userPoolId;
  }

  async createUser(
    email: string,
    temporaryPassword: string,
    permanent = false
  ) {
    try {
      const command = new AdminCreateUserCommand({
        UserPoolId: this.userPoolId,
        Username: email,
        UserAttributes: [
          {
            Name: "email",
            Value: email,
          },
          {
            Name: "email_verified",
            Value: "true",
          },
        ],
        TemporaryPassword: temporaryPassword,
        MessageAction: "SUPPRESS", // Don't send welcome email
      });

      const result = await this.client.send(command);
      console.log(`✅ User created: ${email}`);

      if (permanent) {
        await this.setUserPassword(email, temporaryPassword, true);
        console.log(`✅ Password set as permanent for: ${email}`);
      }

      return result;
    } catch (error: any) {
      if (error.name === "UsernameExistsException") {
        console.log(`⚠️  User already exists: ${email}`);
        return null;
      }
      throw error;
    }
  }

  async setUserPassword(username: string, password: string, permanent = true) {
    const command = new AdminSetUserPasswordCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      Password: password,
      Permanent: permanent,
    });

    return await this.client.send(command);
  }

  async addUserToGroup(username: string, groupName: string) {
    try {
      const command = new AdminAddUserToGroupCommand({
        UserPoolId: this.userPoolId,
        Username: username,
        GroupName: groupName,
      });

      await this.client.send(command);
      console.log(`✅ Added ${username} to group: ${groupName}`);
    } catch (error: any) {
      if (error.name === "ResourceNotFoundException") {
        console.log(`⚠️  Group '${groupName}' does not exist. Creating it...`);
        await this.createGroup(groupName);
        await this.addUserToGroup(username, groupName);
      } else {
        throw error;
      }
    }
  }

  async removeUserFromGroup(username: string, groupName: string) {
    const command = new AdminRemoveUserFromGroupCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      GroupName: groupName,
    });

    await this.client.send(command);
    console.log(`✅ Removed ${username} from group: ${groupName}`);
  }

  async getUserGroups(username: string) {
    const command = new AdminListGroupsForUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });

    const result = await this.client.send(command);
    return result.Groups?.map((group) => group.GroupName) || [];
  }

  async getUser(username: string) {
    try {
      const command = new AdminGetUserCommand({
        UserPoolId: this.userPoolId,
        Username: username,
      });

      return await this.client.send(command);
    } catch (error: any) {
      if (error.name === "UserNotFoundException") {
        return null;
      }
      throw error;
    }
  }

  async listUsers(limit = 60) {
    const command = new ListUsersCommand({
      UserPoolId: this.userPoolId,
      Limit: limit,
    });

    const result = await this.client.send(command);
    return result.Users || [];
  }

  async createGroup(groupName: string, description?: string) {
    try {
      const command = new CreateGroupCommand({
        UserPoolId: this.userPoolId,
        GroupName: groupName,
        Description: description || `${groupName} group`,
      });

      await this.client.send(command);
      console.log(`✅ Created group: ${groupName}`);
    } catch (error: any) {
      if (error.name === "GroupExistsException") {
        console.log(`⚠️  Group already exists: ${groupName}`);
      } else {
        throw error;
      }
    }
  }

  async listGroups() {
    const command = new ListGroupsCommand({
      UserPoolId: this.userPoolId,
    });

    const result = await this.client.send(command);
    return result.Groups || [];
  }

  async deleteUser(username: string) {
    const command = new AdminDeleteUserCommand({
      UserPoolId: this.userPoolId,
      Username: username,
    });

    await this.client.send(command);
    console.log(`✅ Deleted user: ${username}`);
  }

  async updateUserAttributes(
    username: string,
    attributes: { [key: string]: string }
  ) {
    const userAttributes = Object.entries(attributes).map(([name, value]) => ({
      Name: name,
      Value: value,
    }));

    const command = new AdminUpdateUserAttributesCommand({
      UserPoolId: this.userPoolId,
      Username: username,
      UserAttributes: userAttributes,
    });

    await this.client.send(command);
    console.log(`✅ Updated attributes for user: ${username}`);
  }
}
