import dotenv from 'dotenv';

dotenv.config();

export const env = {
  MONGODB_URI: process.env.MONGODB_URI || '',
  JWT_SECRET: process.env.JWT_SECRET || 'default_secret',
  JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN || '7d',
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',
  FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:3000',
  API_URL: process.env.API_URL || 'http://localhost:3000',
};

// Validação básica das variáveis de ambiente críticas
if (!process.env.MONGODB_URI) {
  console.warn('⚠️  MONGODB_URI não definido no .env');
}

if (!process.env.JWT_SECRET) {
  console.warn('⚠️  JWT_SECRET não definido no .env - usando valor padrão (INSEGURO)');
}


