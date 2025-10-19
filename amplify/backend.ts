import { defineBackend } from "@aws-amplify/backend";
import { auth } from "./auth/resource";
import { data } from "./data/resource";
import { createSuperuser } from "./functions/create-superuser/resource";
import { createSuperuserApi } from "./functions/create-superuser-api/resource";
import { PolicyStatement } from "aws-cdk-lib/aws-iam";
import { RestApi, LambdaIntegration, Cors } from "aws-cdk-lib/aws-apigateway";

/**
 * @see https://docs.amplify.aws/react/build-a-backend/ to add storage, functions, and more
 */
const backend = defineBackend({
  auth,
  data,
  createSuperuser,
  createSuperuserApi,
});

// Grant the Lambda functions permissions to manage Cognito users
const cognitoPermissions = new PolicyStatement({
  actions: [
    "cognito-idp:AdminCreateUser",
    "cognito-idp:AdminSetUserPassword",
    "cognito-idp:AdminAddUserToGroup",
    "cognito-idp:AdminGetUser",
  ],
  resources: [backend.auth.resources.userPool.userPoolArn],
});

// Add permissions to both functions
backend.createSuperuser.resources.lambda.addToRolePolicy(cognitoPermissions);
backend.createSuperuserApi.resources.lambda.addToRolePolicy(cognitoPermissions);

// Add environment variables for the User Pool ID
backend.createSuperuser.addEnvironment(
  "AMPLIFY_AUTH_USERPOOL_ID",
  backend.auth.resources.userPool.userPoolId
);

backend.createSuperuserApi.addEnvironment(
  "AMPLIFY_AUTH_USERPOOL_ID",
  backend.auth.resources.userPool.userPoolId
);

// Create REST API for the superuser creation
const restApi = new RestApi(
  backend.createSuperuserApi.stack,
  "CreateSuperuserApi",
  {
    restApiName: "Hendrix Admin API",
    description: "API for administrative functions",
    defaultCorsPreflightOptions: {
      allowOrigins: Cors.ALL_ORIGINS,
      allowMethods: Cors.ALL_METHODS,
      allowHeaders: ["Content-Type", "Authorization"],
    },
  }
);

// Add the Lambda integration
const lambdaIntegration = new LambdaIntegration(
  backend.createSuperuserApi.resources.lambda
);

// Create the /create-superuser endpoint
const createSuperuserResource = restApi.root.addResource("create-superuser");
createSuperuserResource.addMethod("POST", lambdaIntegration);
createSuperuserResource.addMethod("OPTIONS", lambdaIntegration);
