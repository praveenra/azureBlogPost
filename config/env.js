import { loadSecrets } from "./secrets.js";

export async function loadEnvironment() {
  const env = process.env.NODE_ENV || "development";
  console.log(` env: ${env}`);
  if (env === "production") {
    await loadSecrets(process.env.SECRET_NAME);
  } else {
    const dotenv = await import("dotenv");
    dotenv.config();
    console.log("✅ Loaded environment from .env");
  }
}