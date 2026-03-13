import { SecretClient } from "@azure/keyvault-secrets";
import { DefaultAzureCredential } from "@azure/identity";

const keyVaultName = process.env.KEY_VAULT_NAME || "blogpostPROD";
const kvUri = `https://${keyVaultName}.vault.azure.net`;

const credential = new DefaultAzureCredential();
const client = new SecretClient(kvUri, credential);

export async function loadSecrets(secretNames = []) {
  if (!secretNames.length) {
    throw new Error("Secret names are required");
  }

  for (const name of secretNames) {
    const secret = await client.getSecret(name);

    if (secret?.value) {
      process.env[name] = secret.value;
    }
  }

  console.log("✅ Secrets loaded from Azure Key Vault");
}