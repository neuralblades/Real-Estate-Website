const { Inquiry, Property, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Create a new inquiry
// @route   POST /api/inquiries
// @access  Public
const createInquiry = async (req, res) => {
  try {
    const { property, name, email, phone, message } = req.body;

    // Validate property ID
    if (!property || property === 'undefined' || isNaN(Number(property))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    // Check if property exists
    const propertyExists = await Property.findByPk(property);
    if (!propertyExists) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Create inquiry
    const inquiry = await Inquiry.create({
      propertyId: property,
      name,
      email,
      phone,
      message,
      userId: req.user ? req.user.id : null,
    });

    // Get the inquiry with property details
    const inquiryWithProperty = await Inquiry.findByPk(inquiry.id, {
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'mainImage'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      inquiry: inquiryWithProperty,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all inquiries for a property
// @route   GET /api/inquiries/property/:id
// @access  Private/Agent
const getPropertyInquiries = async (req, res) => {
  try {
    // Check if id is valid
    const id = req.params.id;
    if (!id || id === 'undefined' || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    const property = await Property.findByPk(id);

    if (!property) {
      return res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }

    // Check if user is the agent or admin
    if (
      property.agentId !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view these inquiries',
      });
    }

    const inquiries = await Inquiry.findAll({
      where: { propertyId: req.params.id },
      order: [['createdAt', 'DESC']],
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'mainImage'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    res.json({
      success: true,
      inquiries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all inquiries for an agent
// @route   GET /api/inquiries/agent
// @access  Private/Agent
const getAgentInquiries = async (req, res) => {
  try {
    // Get all properties by the agent
    const properties = await Property.findAll({
      where: { agentId: req.user.id },
      attributes: ['id'],
    });

    const propertyIds = properties.map((property) => property.id);

    if (propertyIds.length === 0) {
      return res.json({
        success: true,
        inquiries: [],
      });
    }

    // Get all inquiries for these properties
    const inquiries = await Inquiry.findAll({
      where: {
        propertyId: { [Op.in]: propertyIds },
      },
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'mainImage'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      inquiries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Update inquiry status
// @route   PUT /api/inquiries/:id
// @access  Private/Agent
const updateInquiryStatus = async (req, res) => {
  try {
    // Check if id is valid
    const id = req.params.id;
    if (!id || id === 'undefined' || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid inquiry ID',
      });
    }

    const inquiry = await Inquiry.findByPk(id, {
      include: [
        {
          model: Property,
          as: 'property',
        },
      ],
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    // Check if user is the agent or admin
    if (
      inquiry.property.agentId !== req.user.id &&
      req.user.role !== 'admin'
    ) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this inquiry',
      });
    }

    // Update status
    await inquiry.update({ status: req.body.status });

    // Get updated inquiry with all associations
    const updatedInquiry = await Inquiry.findByPk(req.params.id, {
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'mainImage'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
    });

    res.json({
      success: true,
      inquiry: updatedInquiry,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Get all inquiries (admin only)
// @route   GET /api/inquiries
// @access  Private/Admin
const getAllInquiries = async (req, res) => {
  try {
    const inquiries = await Inquiry.findAll({
      include: [
        {
          model: Property,
          as: 'property',
          attributes: ['id', 'title', 'mainImage'],
        },
        {
          model: User,
          as: 'user',
          attributes: ['id', 'firstName', 'lastName', 'email'],
        },
      ],
      order: [['createdAt', 'DESC']],
    });

    res.json({
      success: true,
      inquiries,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

module.exports = {
  createInquiry,
  getPropertyInquiries,
  getAgentInquiries,
  updateInquiryStatus,
  getAllInquiries,
};
