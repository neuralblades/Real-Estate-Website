const express = require('express');
const router = express.Router();
const {
  getDevelopers,
  getFeaturedDevelopers,
  getDeveloperById,
  getDeveloperBySlug,
  getDeveloperProperties,
  getDeveloperPropertiesBySlug,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
} = require('../controllers/developerController');
const { protect, admin } = require('../middleware/authMiddleware');
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
      `developer-${Date.now()}${path.extname(file.originalname)}`
    );
  },
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: function (req, file, cb) {
    const filetypes = /jpeg|jpg|png|webp/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(
      path.extname(file.originalname).toLowerCase()
    );

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Only image files are allowed!'));
  },
});

// Public routes
router.get('/', getDevelopers);
router.get('/featured', getFeaturedDevelopers);
router.get('/slug/:slug', getDeveloperBySlug);
router.get('/slug/:slug/properties', getDeveloperPropertiesBySlug);
router.get('/:id', getDeveloperById);
router.get('/:id/properties', getDeveloperProperties);

// Protected routes
router.post('/', protect, admin, upload.single('logo'), createDeveloper);
router.put('/:id', protect, admin, upload.single('logo'), updateDeveloper);
router.delete('/:id', protect, admin, deleteDeveloper);

module.exports = router;
