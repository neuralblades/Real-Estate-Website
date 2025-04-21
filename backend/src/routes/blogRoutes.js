const express = require('express');
const router = express.Router();
const {
  getBlogPosts,
  getFeaturedBlogPosts,
  getRecentBlogPosts,
  getBlogPostById,
  getBlogPostBySlug,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  getBlogCategories,
  getBlogTags,
  addBlogComment,
  approveBlogComment,
  rejectBlogComment
} = require('../controllers/blogController');
const { protect, admin } = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');

// Configure multer for file uploads
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../../uploads/blog/'));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      `blog-${Date.now()}${path.extname(file.originalname)}`
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
    cb(new Error('Only image files are allowed!'));
  },
});

// Public routes
router.get('/', getBlogPosts);
router.get('/featured', getFeaturedBlogPosts);
router.get('/recent', getRecentBlogPosts);
router.get('/categories', getBlogCategories);
router.get('/tags', getBlogTags);
router.get('/id/:id', getBlogPostById);
router.get('/slug/:slug', getBlogPostBySlug);

// Protected routes
router.post('/', protect, upload.single('featuredImage'), createBlogPost);
router.put('/:id', protect, upload.single('featuredImage'), updateBlogPost);
router.delete('/:id', protect, deleteBlogPost);

// Comment routes
router.post('/comments', protect, addBlogComment);
router.put('/comments/:id/approve', protect, admin, approveBlogComment);
router.put('/comments/:id/reject', protect, admin, rejectBlogComment);

module.exports = router;
