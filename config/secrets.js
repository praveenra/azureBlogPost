import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

const keyVaultName = process.env.SECRET_NAME || "blogpostsm";
const kvUri = `https://${keyVaultName.toLowerCase()}.vault.azure.net`;
const credential = new DefaultAzureCredential();
const client = new SecretClient(kvUri, credential);

export async function loadSecrets() {
  try {
    for await (const secretProps of client.listPropertiesOfSecrets()) {
      const name = secretProps.name;

      try {
        const secret = await client.getSecret(name);

        // Convert kebab-case → ENV format
        const envName = name.toUpperCase().replace(/-/g, "_");

        process.env[envName] = secret.value;

        console.log(`✅ Loaded ${envName}`);
      } catch (error) {
        console.error(`❌ Failed to load secret ${name}:`, error.message);
      }
    }
  } catch (error) {
    console.error('❌ Failed to list secrets from Key Vault:', error.message);
    throw error; // Re-throw to be caught by caller
  }
}

export async function loadSecretsAWS(secretNames = []) {
  const names = Array.isArray(secretNames)
    ? secretNames
    : (typeof secretNames === "string" && secretNames.trim()
        ? secretNames.split(",").map((s) => s.trim())
        : []);

  if (!names.length) {
    throw new Error("Secret names are required");
  }

  for (const name of names) {
    const secret = await client.getSecret(name);
    log(`Loaded secret: ${secret}`);
    if (secret?.value) {
      process.env[name] = secret.value;
    }
  }

  console.log("✅ Secrets loaded from Azure Key Vault");
}