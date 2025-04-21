const express = require('express');
const router = express.Router();
const documentRequestController = require('../controllers/documentRequestController');
const { protect, admin } = require('../middleware/authMiddleware');

// Public route for creating document requests
router.post('/', documentRequestController.createDocumentRequest);

// Test route to check if document requests are working
router.get('/test', (req, res) => {
  res.status(200).json({
    success: true,
    message: 'Document request routes are working',
    timestamp: new Date().toISOString()
  });
});

// Test route to check if document requests exist in the database
router.get('/test-db', async (req, res) => {
  try {
    const { DocumentRequest } = require('../models');
    const count = await DocumentRequest.count();
    const requests = await DocumentRequest.findAll({ limit: 5 });

    res.status(200).json({
      success: true,
      message: 'Document request database test',
      count,
      requests: requests.map(r => ({
        id: r.id,
        firstName: r.firstName,
        lastName: r.lastName,
        email: r.email,
        requestType: r.requestType,
        status: r.status,
        createdAt: r.createdAt
      }))
    });
  } catch (error) {
    console.error('Error testing document requests:', error);
    res.status(500).json({
      success: false,
      message: 'Error testing document requests',
      error: error.message
    });
  }
});

// Admin routes - protected
router.get('/', protect, admin, documentRequestController.getAllDocumentRequests);
router.get('/:id', protect, admin, documentRequestController.getDocumentRequestById);
router.put('/:id', protect, admin, documentRequestController.updateDocumentRequestStatus);
router.delete('/:id', protect, admin, documentRequestController.deleteDocumentRequest);

module.exports = router;
