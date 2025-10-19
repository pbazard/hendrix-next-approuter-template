import { defineFunction } from "@aws-amplify/backend";

export const createSuperuserApi = defineFunction({
  name: "create-superuser-api",
  entry: "./handler.ts",
  environment: {
    ADMIN_SECRET_KEY: "your-secret-key-here", // Change this to a secure secret
  },
  runtime: 18,
  timeoutSeconds: 30,
});
