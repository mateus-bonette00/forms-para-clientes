import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import clientRoutes from './routes/clientRoutes';
import adminRoutes from './routes/adminRoutes';
import uploadRoutes from './routes/uploadRoutes';

dotenv.config();

const app = express();

// Configure middlewares
app.use(
  cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);

app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Healthcheck (handles both /health and /api/health)
app.get(['/health', '/api/health'], (req: Request, res: Response) => {
  res.json({
    status: 'ok',
    environment: process.env.VERCEL ? 'vercel-serverless' : 'local',
    hasDatabaseUrl: Boolean(process.env.DATABASE_URL),
    timestamp: new Date().toISOString(),
  });
});

// Register routes
app.use(['/', '/api'], clientRoutes);
app.use(['/admin', '/api/admin'], adminRoutes);
app.use(['/upload', '/api/upload'], uploadRoutes);

// Global Error Handler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  console.error('Erro não tratado na API:', err);
  res.status(500).json({
    error: 'Erro interno do servidor',
    message: err?.message || 'Ocorreu um erro inesperado.',
  });
});

export default app;
