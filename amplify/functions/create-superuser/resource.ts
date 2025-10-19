import { defineFunction } from "@aws-amplify/backend";

export const createSuperuser = defineFunction({
  name: "create-superuser",
  entry: "./handler.ts",
  environment: {
    // Amplify will automatically provide these environment variables
    // AMPLIFY_AUTH_USERPOOL_ID will be available at runtime
  },
  runtime: 18,
  timeoutSeconds: 30,
});
