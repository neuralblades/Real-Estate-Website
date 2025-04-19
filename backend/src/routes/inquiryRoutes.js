const express = require('express');
const router = express.Router();
const {
  createInquiry,
  getPropertyInquiries,
  getAgentInquiries,
  updateInquiryStatus,
  getAllInquiries,
} = require('../controllers/inquiryController');
const { protect, agent, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/', createInquiry);

// Protected routes
router.get('/property/:id', protect, agent, getPropertyInquiries);
router.get('/agent', protect, agent, getAgentInquiries);
router.put('/:id', protect, agent, updateInquiryStatus);

// Admin routes
router.get('/', protect, admin, getAllInquiries);

module.exports = router;
