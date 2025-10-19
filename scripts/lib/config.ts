import { readFileSync } from "fs";
import { join } from "path";

export interface AmplifyConfig {
  auth: {
    user_pool_id: string;
    aws_region: string;
    user_pool_client_id: string;
  };
}

export function loadAmplifyConfig(): AmplifyConfig {
  try {
    const configPath = join(process.cwd(), "amplify_outputs.json");
    const configContent = readFileSync(configPath, "utf-8");
    return JSON.parse(configContent);
  } catch (error) {
    console.error("❌ Failed to load amplify_outputs.json");
    console.error("Make sure you have deployed your Amplify backend first:");
    console.error("  npx amplify sandbox");
    process.exit(1);
  }
}

export function getRequiredEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.error(`❌ Required environment variable ${name} is not set`);
    process.exit(1);
  }
  return value;
}
