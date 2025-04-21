const { OffplanInquiry, Property } = require('../models');

// @desc    Create a new offplan inquiry
// @route   POST /api/offplan-inquiries
// @access  Public
const createOffplanInquiry = async (req, res) => {
  try {
    const {
      propertyId,
      propertyTitle,
      name,
      email,
      phone,
      preferredLanguage,
      message,
      interestedInMortgage
    } = req.body;

    // Validate required fields
    if (!propertyId || !name || !email || !phone) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: propertyId, name, email, phone'
      });
    }

    // Validate property exists
    try {
      const property = await Property.findByPk(propertyId);
      if (!property) {
        return res.status(404).json({
          success: false,
          message: 'Property not found'
        });
      }

      // Check if property is offplan
      if (!property.isOffplan) {
        console.warn(`Warning: Inquiry submitted for property ${propertyId} which is not marked as offplan`);
      }
    } catch (error) {
      console.error('Error validating property:', error);
      // Continue with the inquiry creation even if property validation fails
    }

    // Check for duplicate inquiries (same email and property within the last hour)
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    const existingInquiry = await OffplanInquiry.findOne({
      where: {
        propertyId,
        email,
        createdAt: {
          [require('sequelize').Op.gte]: oneHourAgo
        }
      }
    });

    if (existingInquiry) {
      console.log('Duplicate inquiry detected:', {
        propertyId,
        email,
        existingId: existingInquiry.id
      });

      // Return the existing inquiry instead of creating a new one
      return res.status(200).json({
        success: true,
        message: 'Inquiry already submitted',
        inquiry: existingInquiry,
        isDuplicate: true
      });
    }

    // Create the offplan inquiry
    const offplanInquiry = await OffplanInquiry.create({
      propertyId,
      propertyTitle,
      name,
      email,
      phone,
      preferredLanguage: preferredLanguage || 'english',
      message,
      interestedInMortgage: interestedInMortgage || false,
      status: 'new'
    });

    res.status(201).json({
      success: true,
      message: 'Offplan inquiry submitted successfully',
      inquiry: offplanInquiry
    });
  } catch (error) {
    console.error('Error creating offplan inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get all offplan inquiries
// @route   GET /api/offplan-inquiries
// @access  Private/Admin
const getAllOffplanInquiries = async (req, res) => {
  try {
    const { status, sort = 'createdAt', order = 'DESC', page = 1, limit = 50 } = req.query;

    // Build query
    const query = {};

    if (status) {
      query.status = status;
    }

    // Count total documents
    const total = await OffplanInquiry.count({ where: query });

    // Execute query with pagination
    const offplanInquiries = await OffplanInquiry.findAll({
      where: query,
      order: [[sort, order]],
      offset: (page - 1) * limit,
      limit: parseInt(limit),
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'location', 'price', 'mainImage', 'isOffplan']
        }
      ]
    });

    // Group inquiries by property to handle duplicates
    const propertyGroups = {};

    // Process inquiries to group by property
    offplanInquiries.forEach(inquiry => {
      const propertyId = inquiry.propertyId;

      // If this property hasn't been seen yet, or if this inquiry has a property image and the existing one doesn't
      if (!propertyGroups[propertyId] ||
          (inquiry.property?.mainImage && !propertyGroups[propertyId].property?.mainImage)) {
        propertyGroups[propertyId] = inquiry;
      }
    });

    // Convert back to array
    const uniqueInquiries = Object.values(propertyGroups);

    res.status(200).json({
      success: true,
      count: uniqueInquiries.length,
      total: uniqueInquiries.length, // Update total to reflect unique count
      page: parseInt(page),
      pages: Math.ceil(uniqueInquiries.length / limit),
      inquiries: uniqueInquiries
    });
  } catch (error) {
    console.error('Error fetching offplan inquiries:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get offplan inquiry by ID
// @route   GET /api/offplan-inquiries/:id
// @access  Private/Admin
const getOffplanInquiryById = async (req, res) => {
  try {
    const offplanInquiry = await OffplanInquiry.findByPk(req.params.id, {
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'location', 'price', 'mainImage', 'isOffplan']
        }
      ]
    });

    if (!offplanInquiry) {
      return res.status(404).json({
        success: false,
        message: 'Offplan inquiry not found'
      });
    }

    res.status(200).json({
      success: true,
      inquiry: offplanInquiry
    });
  } catch (error) {
    console.error('Error fetching offplan inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update offplan inquiry status
// @route   PATCH /api/offplan-inquiries/:id
// @access  Private/Admin
const updateOffplanInquiryStatus = async (req, res) => {
  try {
    console.log('Update status request received:', {
      id: req.params.id,
      body: req.body,
      user: req.user ? `${req.user.id} (${req.user.role})` : 'No user'
    });

    const { status } = req.body;

    if (!status || !['new', 'in-progress', 'resolved'].includes(status)) {
      console.log('Invalid status provided:', status);
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid status (new, in-progress, resolved)'
      });
    }

    // Check if the ID is valid
    if (!req.params.id) {
      console.log('No ID provided in request params');
      return res.status(400).json({
        success: false,
        message: 'Please provide a valid inquiry ID'
      });
    }

    console.log('Looking for inquiry with ID:', req.params.id);
    const offplanInquiry = await OffplanInquiry.findByPk(req.params.id);

    if (!offplanInquiry) {
      console.log('Inquiry not found with ID:', req.params.id);
      return res.status(404).json({
        success: false,
        message: 'Offplan inquiry not found'
      });
    }

    console.log('Found inquiry:', {
      id: offplanInquiry.id,
      currentStatus: offplanInquiry.status,
      newStatus: status
    });

    offplanInquiry.status = status;
    await offplanInquiry.save();
    console.log('Status updated successfully');

    res.status(200).json({
      success: true,
      message: 'Offplan inquiry status updated successfully',
      inquiry: offplanInquiry
    });
  } catch (error) {
    console.error('Error updating offplan inquiry status:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete offplan inquiry
// @route   DELETE /api/offplan-inquiries/:id
// @access  Private/Admin
const deleteOffplanInquiry = async (req, res) => {
  try {
    const offplanInquiry = await OffplanInquiry.findByPk(req.params.id);

    if (!offplanInquiry) {
      return res.status(404).json({
        success: false,
        message: 'Offplan inquiry not found'
      });
    }

    await offplanInquiry.destroy();

    res.status(200).json({
      success: true,
      message: 'Offplan inquiry deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting offplan inquiry:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  createOffplanInquiry,
  getAllOffplanInquiries,
  getOffplanInquiryById,
  updateOffplanInquiryStatus,
  deleteOffplanInquiry
};
