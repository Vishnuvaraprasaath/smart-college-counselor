import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initTables } from './database/database.js';
import { seedDatabase } from './database/seedData.js';
import counselingRoutes from './routes/counselingRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import aiRoutes from './routes/aiRoutes.js';
import tamilNaduRoutes from './routes/tamilNaduRoutes.js';
import tneaRoutes from './routes/tneaRoutes.js';
import adminImportRoutes from './routes/adminImportRoutes.js';

import sequelize from './models/index.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS 
  ? process.env.ALLOWED_ORIGINS.split(',').map(o => o.trim())
  : ['http://localhost:3000', 'http://127.0.0.1:3000'];

if (process.env.FRONTEND_URL) {
  process.env.FRONTEND_URL.split(',').forEach(url => {
    const trimmed = url.trim();
    if (trimmed && !allowedOrigins.includes(trimmed)) {
      allowedOrigins.push(trimmed);
    }
  });
}

app.use(cors({
  origin: (origin, callback) => {
    if (!origin) return callback(null, true);
    if (allowedOrigins.includes(origin) || process.env.NODE_ENV === 'development') {
      return callback(null, true);
    }
    // Allow Vercel preview URLs if FRONTEND_URL points to a Vercel project
    if (origin.endsWith('.vercel.app') && allowedOrigins.some(o => o.includes('.vercel.app'))) {
      return callback(null, true);
    }
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true
}));
app.use(express.json());

// Routes
app.use('/api', counselingRoutes);
app.use('/api', collegeRoutes);
app.use('/api', courseRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/tamilnadu', tamilNaduRoutes);
app.use('/api/tnea', tneaRoutes);
app.use('/api', tneaRoutes); // mounts /api/data-status
app.use('/api/admin', adminImportRoutes);

// Root endpoint: Redirect browser requests to Frontend UI
const frontendRedirectUrl = process.env.FRONTEND_URL 
  ? process.env.FRONTEND_URL.split(',')[0].trim() 
  : 'http://localhost:3000';

app.get('/', (req, res) => {
  if (req.accepts('html')) {
    return res.redirect(frontendRedirectUrl);
  }
  res.json({
    name: 'SmartCounsel AI Backend API',
    status: 'online',
    frontend: frontendRedirectUrl,
    endpoints: {
      health: '/api/health',
      dataStatus: '/api/data-status',
      colleges: '/api/tamilnadu/colleges',
      districts: '/api/tamilnadu/districts'
    }
  });
});

// Health check endpoint
app.get('/api/health', async (req, res) => {
  let dbStatus = 'disconnected';
  try {
    await sequelize.authenticate();
    dbStatus = 'connected';
  } catch (err) {
    dbStatus = 'disconnected';
  }

  const isOk = dbStatus === 'connected';
  res.status(isOk ? 200 : 503).json({
    status: isOk ? 'ok' : 'degraded',
    database: dbStatus,
    system: 'Smart College Admission Counselor Agent API',
    timestamp: new Date().toISOString()
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err.message);
  const isDbError = err.name?.includes('Sequelize') || err.message?.includes('ECONNREFUSED');
  res.status(isDbError ? 503 : 500).json({
    error: isDbError 
      ? 'Database connection unavailable. Please start MySQL and try again.' 
      : 'Unable to connect to the counseling service. Please try again.'
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('Initializing database schema...');
    await initTables();
    await seedDatabase();

    app.listen(PORT, '0.0.0.0', () => {
      console.log(`====================================================`);
      console.log(`🚀 SmartCounsel API Server running on port ${PORT}`);
      console.log(`🌍 Mode: ${process.env.NODE_ENV || 'development'}`);
      console.log(`🔗 Health check: /api/health`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
