import { AppError } from '../src/utils/appError.js';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const packageJsonPath = join(__dirname, '../package.json');
const packageJsonData = readFileSync(packageJsonPath, 'utf-8');
const { version } = JSON.parse(packageJsonData);
const PORT = process.env.PORT ?? 4040;

// ====== App Config ======
const appConfig = {
  MONGO_URI: process.env.MONGO_URI ?? 'mongodb://localhost:27017/boiler',
  PORT,
  NODE_ENV: process.env.NODE_ENV ?? 'production',
  APP_URL: process.env.APP_URL ?? `http://localhost:${PORT}`,
  APP_NAME: process.env.APP_NAME ?? 'boiler',
  VERSION: version,
  QUEUE_FILE : process.env.QUEUE_FILE,
  UPLOAD_DIR : process.env.UPLOAD_DIR
};

// ====== LLM Config ======
const llmConfig = {
  MODEL_PROVIDER: process.env.MODEL_PROVIDER ?? 'No model provider is provided',

  // Groq Config
  GROQ_API_KEY: process.env.GROQ_API_KEY ?? 'Groq api key not provided',
  GROQ_MODEL: process.env.GROQ_MODEL ?? 'Groq model not provided',

  HUGGINGFACE_API_KEY: process.env.HUGGINGFACE_API_KEY ?? 'Huggingface api key not provided',
  HUGGINGFACE_MODEL: process.env.HUGGINGFACE_MODEL ?? 'Huggingface model not provided',
};

// ====== DB Config ======
const dbConfig = {
  QDRANT_URL : process.env.QDRANT_URL,
  QDRANT_COLLECTION_NAME : process.env.QDRANT_COLLECTION_NAME,
}

// ====== JWT Config ======
const jwtConfig = {
  JWT_SECRET: process.env.JWT_SECRET ?? 'secret',
  JWT_EXPIRY: process.env.JWT_EXPIRY ?? '1d',
  JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET ?? 'secret',
  JWT_REFRESH_EXPIRY: process.env.JWT_REFRESH_EXPIRY ?? '7d',
};

// ====== Allowed Origins Config ======
const ALLOWED_ORIGINS = process.env.ALLOWED_ORIGINS
  ? process.env.ALLOWED_ORIGINS.split(',')
  : ['http://localhost:5173'];

// ====== Rate Limiting Config ======
const rateLimitConfig = {
  GLOBAL_RATE_LIMIT_CONFIG: {
    windowMs: 60 * 1000,
    max: parseInt(process.env.GLOBAL_RATE_LIMIT_MAX || '100'),
    keyGenerator: () => 'global',
    handler: (_, __) => {
      throw new AppError({
        message: 'Too many requests, please try again later.',
        statusCode: 429,
      });
    },
  },
  PER_IP_RATE_LIMIT_CONFIG: {
    windowMs: 60 * 1000,
    max: parseInt(process.env.PER_IP_RATE_LIMIT_MAX ?? '') || 10,
    handler: (_, __) => {
      throw new AppError({
        message: 'Too many requests from this IP, please try again later.',
        statusCode: 429,
      });
    },
  },
};

export const config = Object.freeze({
  ...appConfig,
  ...jwtConfig,
  ...rateLimitConfig,
  ...llmConfig,
  ...dbConfig,
  ALLOWED_ORIGINS,
});
