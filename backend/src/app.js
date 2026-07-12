import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import rateLimit from 'express-rate-limit';
import authRoutes from './routes/auth.routes.js';
import transactionRoutes from './routes/transaction.routes.js';
import budgetRoutes from './routes/budget.routes.js';
import analyticsRoutes from './routes/analytics.routes.js';
import { notFound, errorHandler } from './middleware/error.middleware.js';

const app = express();

// Render (and most cloud hosts) sit behind a reverse proxy that sets
// X-Forwarded-For. Without this, express-rate-limit throws
// ERR_ERL_UNEXPECTED_X_FORWARDED_FOR and crashes every request.
app.set('trust proxy', 1);

app.use(helmet());

app.use(cors({ origin: process.env.CLIENT_URL, credentials: true }));
app.use(express.json({ limit: '1mb' }));
app.use(cookieParser());
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    limit: 300,
    standardHeaders: true,
    legacyHeaders: false
  })
);

app.get('/api/health', (_req, res) => res.json({ status: 'ok', app: 'CrediScope' }));
app.use('/api/auth', authRoutes);
app.use('/api/transactions', transactionRoutes);
app.use('/api/budgets', budgetRoutes);
app.use('/api/analytics', analyticsRoutes);
app.use(notFound);
app.use(errorHandler);

export default app;