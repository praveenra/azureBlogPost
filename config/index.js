import dotenv from 'dotenv';
import { loadSecrets } from './secrets.js';

dotenv.config();

const nodeEnv = process.env.NODE_ENV || 'development';

if (nodeEnv === 'production') {
  try {
    await loadSecrets();
    console.log('✅ Secrets loaded from Azure Key Vault');
  } catch (error) {
    console.error('❌ Failed to load secrets from Azure Key Vault:', error.message);
    process.exit(1);
  }
} else {
  console.log('✅ Loaded environment from .env');
}

const config = {
  port: process.env.PORT || 3000,
  mongoUri: process.env.MONGODBURI || process.env.mongodburi,
  secretName: process.env.SECRET_NAME || 'blogpostsm',
  nodeEnv,
  keyVaultUri: `https://${(process.env.SECRET_NAME || 'blogpostsm').toLowerCase()}.vault.azure.net`,
};

export default config;