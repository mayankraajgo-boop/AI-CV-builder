import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/db';
import authRoutes from './routes/authRoutes';
import resumeRoutes from './routes/resumeRoutes';
import aiRoutes from './routes/aiRoutes';
import { errorHandler } from './middleware/errorHandler';

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB
connectDB();

// Middleware
app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:3000', credentials: true }));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resumes', resumeRoutes);
app.use('/api/ai', aiRoutes);

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'CVPilot API running' }));

// Error handler
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`CVPilot server running on port ${PORT}`);
});

export default app;
