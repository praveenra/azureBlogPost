import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

const keyVaultName = process.env.SECRET_NAME || "blogpostPROD";
const kvUri = `https://${keyVaultName}.vault.azure.net`;
console.log(`SECRET_NAME: ${SECRET_NAME}`);
console.log(`kvUri: ${kvUri}`);
const credential = new DefaultAzureCredential();
const client = new SecretClient(kvUri, credential);

export async function loadSecrets(secretNames = []) {
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