const express = require('express');
const router = express.Router();
const {
  createOffplanInquiry,
  getAllOffplanInquiries,
  getOffplanInquiryById,
  updateOffplanInquiryStatus,
  deleteOffplanInquiry
} = require('../controllers/offplanInquiryController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public routes
router.post('/', createOffplanInquiry);

// Test route to check if offplan inquiries are working
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Offplan inquiry routes are working',
    timestamp: new Date().toISOString()
  });
});

// Test route for PATCH method
router.patch('/test-patch', (req, res) => {
  const { status } = req.body;
  res.status(200).json({
    success: true,
    message: 'PATCH method is working',
    receivedStatus: status || 'No status provided',
    timestamp: new Date().toISOString(),
    auth: req.headers.authorization ? 'Authorization header present' : 'No authorization header'
  });
});

// Public test route for updating status (no auth required)
router.patch('/test-update/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    if (!status || !['new', 'in-progress', 'resolved'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (new, in-progress, resolved)'
      });
    }

    const { OffplanInquiry } = require('../models');
    const inquiry = await OffplanInquiry.findByPk(id);

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found'
      });
    }

    inquiry.status = status;
    await inquiry.save();

    res.status(200).json({
      success: true,
      message: 'Status updated successfully',
      inquiry: {
        id: inquiry.id,
        status: inquiry.status,
        name: inquiry.name,
        email: inquiry.email,
        updatedAt: inquiry.updatedAt
      }
    });
  } catch (error) {
    console.error('Error in test update route:', error);
    res.status(500).json({
      success: false,
      message: 'Server error',
      error: error.message
    });
  }
});

// Test route to check if offplan inquiries exist in the database
router.get('/test-db', async (req, res) => {
  try {
    const { OffplanInquiry } = require('../models');
    const count = await OffplanInquiry.count();
    const inquiries = await OffplanInquiry.findAll({ limit: 5 });

    res.status(200).json({
      success: true,
      message: 'Offplan inquiry database test',
      count,
      inquiries: inquiries.map(i => ({
        id: i.id,
        name: i.name,
        email: i.email,
        phone: i.phone,
        propertyId: i.propertyId,
        propertyTitle: i.propertyTitle,
        status: i.status,
        createdAt: i.createdAt
      }))
    });
  } catch (error) {
    console.error('Error testing offplan inquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing offplan inquiries',
      error: error.message
    });
  }
});

// Admin routes - protected
router.get('/', protect, admin, getAllOffplanInquiries);
router.get('/:id', protect, admin, getOffplanInquiryById);
router.patch('/:id', protect, admin, updateOffplanInquiryStatus);
router.delete('/:id', protect, admin, deleteOffplanInquiry);

module.exports = router;
