import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { config } from '../config/index.js';
import { AppError } from './utils/appError.js';
import httpLogger from './utils/appLogger.js';
import globalErrorHandler from './middlewares/globalError.mid.js';
import { corsOptions } from '../config/cors.js';

const app = express();

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(httpLogger);
app.use(rateLimit(config.GLOBAL_RATE_LIMIT_CONFIG));
app.use(rateLimit(config.PER_IP_RATE_LIMIT_CONFIG));
app.use(express.json());

app.use('/uploads', express.static('uploads'));

// Routes
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.routes.js';
import llmRoutes from './routes/llm.route.js';
import docRoutes from './routes/doc.route.js';
import indexApiRoutes from './routes/index.route.js';
import systemRoutes from './routes/system.route.js';
import wellKnownRoutes from './routes/wellknown.route.js';

const api = express.Router();

// System routes (not versioned)
app.use('/', indexRoutes);
app.use('/.well-known', wellKnownRoutes);

// API routes (versioned)
api.use('/auth', authRoutes);
api.use('/docs', docRoutes);
api.use('/ask', llmRoutes);
api.use('/index', indexApiRoutes);
api.use('/', systemRoutes); // health and _meta

app.use(`/api/v${config.VERSION.split('.')[0]}`, api);

// 404 handler for undefined routes
app.use((_, __, next) => {
  next(new AppError({ statusCode: 404, message: 'Route not found' }));
});

app.use(globalErrorHandler);
export default app;
