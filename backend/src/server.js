const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

// Load environment variables
dotenv.config();

// Import Sequelize models
const db = require('./models');

// Initialize Express app
const app = express();

// Middleware
app.use(cors({
  origin: ['http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
}));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Add compression middleware for better performance
const compression = require('compression');
app.use(compression());

// Add cache middleware for API responses
const cacheMiddleware = require('./middleware/cacheMiddleware');
app.use('/api', cacheMiddleware);

// Ensure uploads directory exists
const uploadsDir = path.join(__dirname, '../uploads');
const blogUploadsDir = path.join(__dirname, '../uploads/blog');
if (!fs.existsSync(uploadsDir)) {
  console.log('Creating uploads directory...');
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
    console.log('Uploads directory created successfully');
  } catch (err) {
    console.error('Error creating uploads directory:', err);
  }
}

// Ensure blog uploads directory exists
if (!fs.existsSync(blogUploadsDir)) {
  console.log('Creating blog uploads directory...');
  try {
    fs.mkdirSync(blogUploadsDir, { recursive: true });
    console.log('Blog uploads directory created successfully');
  } catch (err) {
    console.error('Error creating blog uploads directory:', err);
  }
}

// Serve static files (for uploaded images)
app.use('/uploads', (req, res, next) => {
  // Set CORS headers specifically for image files
  res.header('Access-Control-Allow-Origin', 'http://localhost:3000');
  res.header('Access-Control-Allow-Methods', 'GET');
  res.header('Access-Control-Allow-Headers', 'Content-Type');

  // Add cache control headers for better performance
  res.header('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800'); // 1 day cache, 7 days stale
  res.header('Expires', new Date(Date.now() + 86400000).toUTCString()); // 1 day

  next();
}, express.static(uploadsDir, {
  setHeaders: (res, filePath) => {
    // Set content type based on file extension
    if (filePath.endsWith('.jpg') || filePath.endsWith('.jpeg')) {
      res.set('Content-Type', 'image/jpeg');
    } else if (filePath.endsWith('.png')) {
      res.set('Content-Type', 'image/png');
    } else if (filePath.endsWith('.webp')) {
      res.set('Content-Type', 'image/webp');
    }

    // Add cache control headers for better performance
    res.set('Cache-Control', 'public, max-age=86400, stale-while-revalidate=604800'); // 1 day cache, 7 days stale
    res.set('Expires', new Date(Date.now() + 86400000).toUTCString()); // 1 day
  },
  fallthrough: false, // Return 404 for missing files
  maxAge: 86400000 // 1 day in milliseconds
}));

// Handle 404 errors for missing images
app.use('/uploads/:filename', (req, res) => {
  console.log('Image not found:', req.originalUrl);
  // Send a placeholder image or a 404 response
  res.status(404).send('Image not found');
});

// API Routes
const propertyRoutes = require('./routes/propertyRoutes');
const userRoutes = require('./routes/userRoutes');
const inquiryRoutes = require('./routes/inquiryRoutes');
const messageRoutes = require('./routes/messageRoutes');
const contactRoutes = require('./routes/contactRoutes');
const developerRoutes = require('./routes/developerRoutes');
const documentRequestRoutes = require('./routes/documentRequestRoutes');
const offplanInquiryRoutes = require('./routes/offplanInquiryRoutes');
const blogRoutes = require('./routes/blogRoutes');
const teamMemberRoutes = require('./routes/teamMemberRoutes');

app.use('/api/properties', propertyRoutes);
app.use('/api/users', userRoutes);
app.use('/api/inquiries', inquiryRoutes);
app.use('/api/messages', messageRoutes);
app.use('/api/contact', contactRoutes);
app.use('/api/developers', developerRoutes);
app.use('/api/document-requests', documentRequestRoutes);
app.use('/api/offplan-inquiries', offplanInquiryRoutes);
app.use('/api/blog', blogRoutes);
app.use('/api/team', teamMemberRoutes);

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
