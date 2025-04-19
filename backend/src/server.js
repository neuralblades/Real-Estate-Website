const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables
dotenv.config();

// Import Sequelize models
const db = require('./models');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files (for uploaded images)
app.use('/uploads', (req, res, next) => {
  // Set CORS headers specifically for image files
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');
  next();
}, express.static(path.join(__dirname, '../uploads'), {
  setHeaders: (res, path) => {
    // Set content type based on file extension
    if (path.endsWith('.jpg') || path.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    } else if (path.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    } else if (path.endsWith('.webp')) {
      res.set('Content-Type', 'image/webp');
    }
  }
}));

// API Routes
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');

app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inquiries', inquiryRoutes);

// Root route
app.get('/', (req, res) => {
  res.send('Real Estate API is running...');
});

// Set port
const PORT = process.env.PORT || 5000;

// Sync database and start server
db.sequelize
  .sync({ alter: process.env.NODE_ENV === 'development' })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log(`Database connected successfully`);
    });
  })
  .catch((err) => {
    console.error('Failed to connect to the database:', err);
    // Start server even if database connection fails
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
      console.log('Running in development mode without database connection');
    });
  });

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server Error',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal Server Error',
  });
});

module.exports = app;
