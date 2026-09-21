import express from 'express';
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
app.get(['/health', '/api/health'], (req, res) => {
  res.json({
    status: 'ok',
    environment: process.env.VERCEL ? 'vercel-serverless' : 'local',
    timestamp: new Date().toISOString(),
  });
});

// Register routes with dual path matching
app.use(['/', '/api'], clientRoutes);
app.use(['/admin', '/api/admin'], adminRoutes);
app.use(['/upload', '/api/upload'], uploadRoutes);

export default app;
