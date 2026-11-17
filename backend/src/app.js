import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { originCheck } from './middleware/originCheck.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';

export const app = express();

app.set('trust proxy', 1); // correct client IPs behind a hosting proxy (needed for rate limiting)
app.disable('x-powered-by');

app.use(helmet());
app.use(cors({ origin: env.clientOrigin, credentials: true }));
app.use(express.json({ limit: '100kb' }));
app.use(cookieParser());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));

app.use('/api', apiLimiter, originCheck);
app.use('/api/auth', authRoutes);
// Next routers (programs, activities, announcements, contact, partnerships, statistics) mount here.

app.use(notFound);
app.use(errorHandler);
