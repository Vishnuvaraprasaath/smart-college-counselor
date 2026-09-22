import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { initTables } from './database/database.js';
import { seedDatabase } from './database/seedData.js';
import counselingRoutes from './routes/counselingRoutes.js';
import collegeRoutes from './routes/collegeRoutes.js';
import courseRoutes from './routes/courseRoutes.js';
import aiRoutes from './routes/aiRoutes.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api', counselingRoutes);
app.use('/api', collegeRoutes);
app.use('/api', courseRoutes);
app.use('/api/ai', aiRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    system: 'Smart College Admission Counselor Agent API',
    timestamp: new Date().toISOString()
  });
});

// Initialize database and start server
const startServer = async () => {
  try {
    console.log('Initializing database schema...');
    await initTables();
    await seedDatabase();

    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 SmartCounsel API Server running on port ${PORT}`);
      console.log(`🔗 Health check: http://localhost:${PORT}/api/health`);
      console.log(`====================================================`);
    });
  } catch (err) {
    console.error('Failed to start server:', err);
  }
};

startServer();
