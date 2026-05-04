import dotenv from 'dotenv';
dotenv.config();

import express from 'express';
import cors from 'cors';
import connectDB from './config/database.js';
import apiRoutes from './routes/index.js';
import startSkillDecayJob from './jobs/skillDecayJob.js';

const app = express();
const PORT = process.env.PORT || 5000;

// HTTP middleware stack
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploaded files as static assets
app.use('/uploads', express.static('./uploads'));

// API health check endpoint
app.get('/api/v1/health', (req, res) => {
  res.status(200).json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    environment: process.env.NODE_ENV || 'development',
  });
});

// Configuration endpoint
app.get('/api/v1/config', (req, res) => {
  res.status(200).json({
    success: true,
    data: {
      apiUrl: process.env.BASE_URL || `http://localhost:${PORT}`,
      fileUploadUrl: `${process.env.BASE_URL || `http://localhost:${PORT}`}/uploads`,
      environment: process.env.NODE_ENV || 'development',
    },
  });
});

// Mount API routes
app.use('/api/v1', apiRoutes);

// Handle 404 - route not found
app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    status: 404,
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('❌ Server error:', err);
  res.status(err.status || 500).json({
    error: err.message || 'Internal server error',
    status: err.status || 500,
  });
});

// Database connection and server startup
const startServer = async () => {
  try {
    await connectDB();
    
    // Start skill decay job
    startSkillDecayJob();

    app.listen(PORT, () => {
      console.log(`🚀 Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/v1/health`);
      console.log(`🗂️  MongoDB: ${process.env.MONGODB_URI}`);
    });
  } catch (error) {
    console.error('❌ Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
