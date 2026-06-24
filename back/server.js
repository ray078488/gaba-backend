const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const db = require('./config/db');

// Load environment variables
dotenv.config();

const app = express();

const path = require('path');

// Middlewares
app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Serve static uploads
app.use('/uploads', express.static(path.join(__dirname, 'public/uploads')));

// Log incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Import route modules
const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');

// Register routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);

// Root route welcome message
app.get('/', (req, res) => {
  res.json({
    message: 'Welcome to the GABA E-Commerce REST API!',
    status: 'online',
    database_mode: db.isMySQL() ? 'MySQL' : 'Local JSON Fallback'
  });
});

// Global Error Handler Middleware
app.use((err, req, res, next) => {
  console.error('❌ Express error:', err.stack);
  res.status(500).json({
    message: 'Something went wrong on the server',
    error: process.env.NODE_ENV === 'production' ? {} : err.message
  });
});

// Start Server
const PORT = process.env.PORT || 5000;

const startServer = async () => {
  try {
    // Connect to database
    await db.connectDB();

    app.listen(PORT, () => {
      console.log(`=========================================`);
      console.log(`🚀 GABA Backend Server is running on port ${PORT}`);
      console.log(`📡 URL: http://localhost:${PORT}`);
      console.log(`=========================================`);
    });
  } catch (error) {
    console.error('❌ Failed to initialize application:', error.message);
    process.exit(1);
  }
};

startServer();
