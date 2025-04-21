const db = require('../models');
const DocumentRequest = db.DocumentRequest;
const Property = db.Property;
const { Op } = require('sequelize');

// Create a new document request
exports.createDocumentRequest = async (req, res) => {
  try {
    console.log('Document request received:', req.body);

    const { firstName, lastName, email, phone, propertyId, propertyTitle, requestType } = req.body;

    // Validate required fields
    if (!firstName || !lastName || !email || !phone || !propertyId || !requestType) {
      console.log('Missing required fields:', { firstName, lastName, email, phone, propertyId, requestType });
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Validate property exists
    let property;
    try {
      console.log('Validating property with ID:', propertyId);
      property = await Property.findByPk(propertyId);

      if (!property) {
        console.log('Property not found with ID:', propertyId);
        return res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      }

      console.log('Property found:', property.title);
    } catch (error) {
      console.error('Error validating property:', error);
      return res.status(500).json({
        success: false,
        message: 'Error validating property',
        error: error.message
      });
    }

    // Create new document request
    console.log('Creating document request with data:', {
      firstName,
      lastName,
      email,
      phone,
      propertyId,
      propertyTitle: propertyTitle || property.title,
      requestType
    });

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

      console.log('Document request created successfully:', documentRequest.id);

      res.status(201).json({
        success: true,
        message: 'Document request created successfully',
        documentRequest
      });
    } catch (createError) {
      console.error('Error creating document request:', createError);
      return res.status(500).json({
        success: false,
        message: 'Error creating document request',
        error: createError.message
      });
    }
  } catch (error) {
    console.error('Error creating document request:', error);
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
    console.log('Getting all document requests, user:', req.user?.id);
    console.log('Query params:', req.query);

    const { requestType, status, sort = 'createdAt', order = 'DESC', page = 1, limit = 10 } = req.query;

    // Build query
    const query = {};

    if (requestType) {
      query.requestType = requestType;
    }

    if (status) {
      query.status = status;
    }

    console.log('Query filter:', query);

    // Count total documents
    try {
      const total = await DocumentRequest.count({ where: query });
      console.log('Total document requests found:', total);

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

      console.log('Document requests retrieved:', documentRequests.length);

      res.status(200).json({
        success: true,
        count: documentRequests.length,
        total,
        page: parseInt(page),
        pages: Math.ceil(total / limit),
        data: documentRequests
      });
    } catch (countError) {
      console.error('Error counting/retrieving document requests:', countError);
      return res.status(500).json({
        success: false,
        message: 'Error retrieving document requests',
        error: countError.message
      });
    }
  } catch (error) {
    console.error('Error fetching document requests:', error);
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
    console.error('Error fetching document request:', error);
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
    console.error('Error updating document request:', error);
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
    console.error('Error deleting document request:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting document request',
      error: error.message
    });
  }
};
