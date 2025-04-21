const express = require('express');
const router = express.Router();
const {
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getAgentProperties,
  getOffPlanProperties,
} = require('../controllers/propertyController');
const { protect, agent } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/'));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `property-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only images are allowed!'));
  },
});

// Public routes
router.get('/', getProperties);
router.get('/featured', getFeaturedProperties);
router.get('/offplan', getOffPlanProperties);
router.get('/agent/:id', getAgentProperties);
router.get('/:id', getPropertyById);

// Configure multer to accept multiple fields
const uploadFields = upload.fields([
  { name: 'images', maxCount: 10 },
  { name: 'headerImage', maxCount: 1 }
]);

// Protected routes
router.post('/', protect, agent, uploadFields, createProperty);
router.put('/:id', protect, agent, uploadFields, updateProperty);
router.delete('/:id', protect, agent, deleteProperty);

module.exports = router;
