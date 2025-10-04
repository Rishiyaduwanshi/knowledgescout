import express from 'express';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import cookieParser from 'cookie-parser';
import { config } from '../config/index.js';
import { AppError } from './utils/appError.js';
import httpLogger from './utils/appLogger.js';
import globalErrorHandler from './middlewares/globalError.mid.js';
import { corsOptions } from '../config/cors.js';
import llm from './services/llm.service.js';

const app = express();

app.use(cors(corsOptions));

app.use(cookieParser());
app.use(httpLogger);
app.use(rateLimit(config.GLOBAL_RATE_LIMIT_CONFIG));
app.use(rateLimit(config.PER_IP_RATE_LIMIT_CONFIG));
app.use(express.json());

// Routes
import indexRoutes from './routes/index.js';
import authRoutes from './routes/auth.routes.js';
import llmRoutes from './routes/llm.route.js';

// API routes

// app.get('/llm', async (req, res) => {
//   try {
//     const aiMsg = await llm.invoke([
//       {
//         role: 'system',
//         content: 'You are a helpful assistant that translates English to Hindi. Translate the user sentence.',
//       },
//       {
//         role: 'user',
//         content: 'Ram likes to read a book.',
//       },
//     ]);

//     console.log(aiMsg);
//     res.json({ translation: aiMsg.content || aiMsg }); // send response to client
//   } catch (error) {
//     console.error(error);
//     res.status(500).send('Error processing request');
//   }
// });

const api = express.Router();


app.use('/', indexRoutes);
api.use('/auth', authRoutes);
api.use('/llm', llmRoutes);

app.use(`/api/v${config.VERSION.split('.')[0]}`, api);


// 404 handler for undefined routes
app.use((_, __, next) => {
  next(new AppError({ statusCode: 404, message: 'Route not found' }));
});

app.use(globalErrorHandler);
export default app;
