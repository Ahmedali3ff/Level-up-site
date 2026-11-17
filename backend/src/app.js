import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { apiLimiter } from './middleware/rateLimit.js';
import { originCheck } from './middleware/originCheck.js';
import { notFound, errorHandler } from './middleware/errorHandler.js';
import authRoutes from './routes/auth.routes.js';
import formsRoutes from './routes/forms.routes.js';
import adminRoutes from './routes/admin.routes.js';
import { resources } from './routes/resources.js';

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
app.use('/api', formsRoutes); // /contact, /partnerships, /search
for (const resource of resources) app.use(`/api/${resource.name}`, resource.pub);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);
