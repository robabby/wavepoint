import { config } from "dotenv";
import { execSync } from "child_process";

config({ path: ".env.local" });

const prodUrl = process.env.PROD_DATABASE_URL;
if (!prodUrl) {
  console.error("PROD_DATABASE_URL is not set in .env.local");
  process.exit(1);
}

console.log("Pushing schema to production database...");
execSync("drizzle-kit push", {
  stdio: "inherit",
  env: { ...process.env, DATABASE_URL: prodUrl },
});
