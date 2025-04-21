const db = require('../models');
const DocumentRequest = db.DocumentRequest;
const Property = db.Property;
const { Op } = require('sequelize');

// Create a new document request
exports.createDocumentRequest = async (req, res) => {
  try {
    const { firstName, lastName, email, phone, propertyId, propertyTitle, requestType } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !propertyId || !requestType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate property exists
    let property;
    try {
      property = await Property.findByPk(propertyId);

      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      }

    } catch (error) {
      return res.status(500).json({
        success: false,
        message: 'Error validating property',
        error: error.message
      });
    }

    // Create new document request

    try {
      const documentRequest = await DocumentRequest.create({
        firstName,
        lastName,
        email,
        phone,
        propertyId,
        propertyTitle: propertyTitle || property.title,
        requestType,
        status: 'pending'
      });

      res.status(201).json({
        success: true,
        message: 'Document request created successfully',
        documentRequest
      });
    } catch (createError) {
      return res.status(500).json({
        success: false,
        message: 'Error creating document request',
        error: createError.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error creating document request',
      error: error.message
    });
  }
};

// Get all document requests
exports.getAllDocumentRequests = async (req, res) => {
  try {
    const { requestType, status, sort = 'createdAt', order = 'DESC', page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};

    if (requestType) {
      query.requestType = requestType;
    }

    if (status) {
      query.status = status;
    }

    // Count total documents
    try {
      const total = await DocumentRequest.count({ where: query });

      // Execute query with pagination
      const documentRequests = await DocumentRequest.findAll({
        where: query,
        order: [[sort, order]],
        offset: (page - 1) * limit,
        limit: parseInt(limit),
        include: [
          {
            model: Property,
            as: 'property',
            attributes: ['id', 'title', 'location', 'price']
          }
        ]
      });

      res.status(200).json({
        success: true,
        count: documentRequests.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        data: documentRequests
      });
    } catch (countError) {
      return res.status(500).json({
        success: false,
        message: 'Error retrieving document requests',
        error: countError.message
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching document requests',
      error: error.message
    });
  }
};

// Get document request by ID
exports.getDocumentRequestById = async (req, res) => {
  try {
    const documentRequest = await DocumentRequest.findByPk(req.params.id, {
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'location', 'price', 'images']
        }
      ]
    });

    if (!documentRequest) {
      return res.status(404).json({
        success: false,
        message: 'Document request not found'
      });
    }

    res.status(200).json({
      success: true,
      data: documentRequest
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching document request',
      error: error.message
    });
  }
};

// Update document request status
exports.updateDocumentRequestStatus = async (req, res) => {
  try {
    const { status } = req.body;

    if (!status || !['pending', 'sent', 'completed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (pending, sent, completed)'
      });
    }

    const documentRequest = await DocumentRequest.findByPk(req.params.id);

    if (!documentRequest) {
      return res.status(404).json({
        success: false,
        message: 'Document request not found'
      });
    }

    documentRequest.status = status;
    await documentRequest.save();

    res.status(200).json({
      success: true,
      data: documentRequest,
      message: 'Document request status updated successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error updating document request',
      error: error.message
    });
  }
};

// Delete document request
exports.deleteDocumentRequest = async (req, res) => {
  try {
    const documentRequest = await DocumentRequest.findByPk(req.params.id);

    if (!documentRequest) {
      return res.status(404).json({
        success: false,
        message: 'Document request not found'
      });
    }

    await documentRequest.destroy();

    res.status(200).json({
      success: true,
      message: 'Document request deleted successfully'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error deleting document request',
      error: error.message
    });
  }
};
