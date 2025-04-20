const { Property, User } = require('../models');
const { Op } = require('sequelize');

// @desc    Get all properties with filtering
// @route   GET /api/properties
// @access  Public
const getProperties = async (req, res) => {
  try {
    const pageSize = 9;
    const page = Number(req.query.page) || 1;

    // Build where clause for filtering
    const whereClause = {};

    // Filter by property type
    if (req.query.type) {
      whereClause.propertyType = req.query.type;
    }

    // Filter by status
    if (req.query.status) {
      whereClause.status = req.query.status;
    }



    // Filter by offplan status
    if (req.query.isOffplan !== undefined) {
      whereClause.isOffplan = req.query.isOffplan === 'true';
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      whereClause.price = {};
      if (req.query.minPrice) {
        whereClause.price[Op.gte] = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        whereClause.price[Op.lte] = Number(req.query.maxPrice);
      }
    }

    // Filter by bedrooms
    if (req.query.bedrooms) {
      whereClause.bedrooms = { [Op.gte]: Number(req.query.bedrooms) };
    }

    // Filter by bathrooms
    if (req.query.bathrooms) {
      whereClause.bathrooms = { [Op.gte]: Number(req.query.bathrooms) };
    }

    // Filter by area range
    if (req.query.minArea || req.query.maxArea) {
      whereClause.area = {};
      if (req.query.minArea) {
        whereClause.area[Op.gte] = Number(req.query.minArea);
      }
      if (req.query.maxArea) {
        whereClause.area[Op.lte] = Number(req.query.maxArea);
      }
    }

    // Filter by location
    if (req.query.location) {
      whereClause.location = { [Op.iLike]: `%${req.query.location}%` };
    }

    // Filter by year built
    if (req.query.yearBuilt) {
      whereClause.yearBuilt = Number(req.query.yearBuilt);
    }

    // Search by keyword
    if (req.query.keyword) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.keyword}%` } },
        { description: { [Op.iLike]: `%${req.query.keyword}%` } },
        { location: { [Op.iLike]: `%${req.query.keyword}%` } },
      ];
    }

    // Get properties with pagination and count
    const { count, rows: properties } = await Property.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'agent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: pageSize * (page - 1),
    });

    res.json({
      success: true,
      properties,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
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

// @desc    Get featured properties
// @route   GET /api/properties/featured
// @access  Public
const getFeaturedProperties = async (req, res) => {
  try {
    const properties = await Property.findAll({
      where: { featured: true },
      include: [
        {
          model: User,
          as: 'agent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatar'],
        },
      ],
      limit: 6,
    });

    res.json({
      success: true,
      properties,
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

// @desc    Get single property by ID
// @route   GET /api/properties/:id
// @access  Public
const getPropertyById = async (req, res) => {
  try {
    // Check if id is valid
    const id = req.params.id;
    if (!id || id === 'undefined' || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid property ID',
      });
    }

    const property = await Property.findByPk(id, {
      include: [
        {
          model: User,
          as: 'agent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatar'],
        },
      ],
    });

    if (property) {
      // Increment views if the field exists
      if (property.views !== undefined) {
        property.views = (property.views || 0) + 1;
        await property.save();
      }

      res.json({
        success: true,
        property,
      });
    } else {
      res.status(404).json({
        success: false,
        message: 'Property not found',
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message,
    });
  }
};

// @desc    Create a new property
// @route   POST /api/properties
// @access  Private/Agent
const createProperty = async (req, res) => {
  try {
    const {
      title,
      description,
      price,
      location,
      address,
      city,
      state,
      zipCode,
      propertyType,
      status,
      bedrooms,
      bathrooms,
      area,
      features,
      yearBuilt,
    } = req.body;

    // Process images
    let images = [];
    let mainImage = '';

    if (req.files && req.files.length > 0) {
      images = req.files.map((file) => `/uploads/${file.filename}`);
      mainImage = images[0]; // Set first image as main image
    }

    // Parse features if it's a string
    let parsedFeatures = features;
    if (typeof features === 'string') {
      try {
        parsedFeatures = JSON.parse(features);
      } catch (e) {
        parsedFeatures = features.split(',').map(item => item.trim());
      }
    }

    // Create property
    const property = await Property.create({
      title,
      description,
      price,
      location,
      address,
      city,
      state,
      zipCode,
      propertyType,
      status,
      isOffplan: req.body.isOffplan === 'true' || req.body.isOffplan === true,
      bedrooms,
      bathrooms,
      area,
      features: parsedFeatures,
      images,
      mainImage,
      agentId: req.user.id,
      yearBuilt,
      featured: false,
    });

    // Fetch the property with agent details
    const propertyWithAgent = await Property.findByPk(property.id, {
      include: [
        {
          model: User,
          as: 'agent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatar'],
        },
      ],
    });

    res.status(201).json({
      success: true,
      property: propertyWithAgent,
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

// @desc    Update a property
// @route   PUT /api/properties/:id
// @access  Private/Agent
const updateProperty = async (req, res) => {
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
        message: 'Not authorized to update this property',
      });
    }

    // Update fields
    const {
      title,
      description,
      price,
      location,
      address,
      city,
      state,
      zipCode,
      propertyType,
      status,
      bedrooms,
      bathrooms,
      area,
      features,
      yearBuilt,
      featured,
      existingImages,
    } = req.body;

    // Create update object
    const updateData = {};

    if (title) updateData.title = title;
    if (description) updateData.description = description;
    if (price) updateData.price = price;
    if (location) updateData.location = location;
    if (address) updateData.address = address;
    if (city) updateData.city = city;
    if (state) updateData.state = state;
    if (zipCode) updateData.zipCode = zipCode;
    if (propertyType) updateData.propertyType = propertyType;
    if (status) updateData.status = status;


    // Handle isOffplan field explicitly if provided
    if (req.body.isOffplan !== undefined) {
      updateData.isOffplan = req.body.isOffplan === 'true' || req.body.isOffplan === true;
    }
    if (bedrooms) updateData.bedrooms = bedrooms;
    if (bathrooms) updateData.bathrooms = bathrooms;
    if (area) updateData.area = area;

    // Parse features if it's a string
    if (features) {
      if (typeof features === 'string') {
        try {
          updateData.features = JSON.parse(features);
        } catch (e) {
          updateData.features = features.split(',').map(item => item.trim());
        }
      } else {
        updateData.features = features;
      }
    }

    if (yearBuilt) updateData.yearBuilt = yearBuilt;
    if (featured !== undefined && req.user.role === 'admin') {
      updateData.featured = featured === 'true' || featured === true;
    }

    // Handle existing images if provided
    if (existingImages) {
      try {
        // Parse the existingImages JSON string
        const parsedImages = JSON.parse(existingImages);
        updateData.images = parsedImages;

        // If images array is empty or if the main image was removed, update main image
        if (parsedImages.length === 0) {
          updateData.mainImage = null;
        } else if (!parsedImages.includes(property.mainImage)) {
          updateData.mainImage = parsedImages[0];
        }
      } catch (e) {
        console.error('Error parsing existingImages:', e);
      }
    }

    // Process new images
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map((file) => `/uploads/${file.filename}`);

      // If existingImages was provided, add new images to the parsed array
      if (updateData.images) {
        updateData.images = [...updateData.images, ...newImages];
      } else {
        // Otherwise, add new images to existing images from the database
        updateData.images = [...(property.images || []), ...newImages];
      }

      // If no main image, set first image as main
      if ((!property.mainImage || updateData.mainImage === null) && updateData.images.length > 0) {
        updateData.mainImage = updateData.images[0];
      }
    }

    // Update the property
    await property.update(updateData);

    // Fetch the updated property with agent details
    const updatedProperty = await Property.findByPk(property.id, {
      include: [
        {
          model: User,
          as: 'agent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatar'],
        },
      ],
    });

    res.json({
      success: true,
      property: updatedProperty,
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

// @desc    Delete a property
// @route   DELETE /api/properties/:id
// @access  Private/Agent
const deleteProperty = async (req, res) => {
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
        message: 'Not authorized to delete this property',
      });
    }

    await property.destroy();

    res.json({
      success: true,
      message: 'Property removed',
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

// @desc    Get properties by agent
// @route   GET /api/properties/agent/:id
// @access  Public
const getAgentProperties = async (req, res) => {
  try {
    // Check if id is valid
    const id = req.params.id;
    if (!id || id === 'undefined' || isNaN(Number(id))) {
      return res.status(400).json({
        success: false,
        message: 'Invalid agent ID',
      });
    }

    const properties = await Property.findAll({
      where: { agentId: id },
      include: [
        {
          model: User,
          as: 'agent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatar'],
        },
      ],
    });

    res.json({
      success: true,
      properties,
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

// @desc    Get off plan properties
// @route   GET /api/properties/offplan
// @access  Public
const getOffPlanProperties = async (req, res) => {
  try {
    const pageSize = 9;
    const page = Number(req.query.page) || 1;

    // Build where clause for filtering
    const whereClause = { isOffplan: true };

    // Filter by property type
    if (req.query.type) {
      whereClause.propertyType = req.query.type;
    }

    // Filter by price range
    if (req.query.minPrice || req.query.maxPrice) {
      whereClause.price = {};
      if (req.query.minPrice) {
        whereClause.price[Op.gte] = Number(req.query.minPrice);
      }
      if (req.query.maxPrice) {
        whereClause.price[Op.lte] = Number(req.query.maxPrice);
      }
    }

    // Filter by bedrooms
    if (req.query.bedrooms) {
      whereClause.bedrooms = { [Op.gte]: Number(req.query.bedrooms) };
    }

    // Filter by location
    if (req.query.location) {
      whereClause.location = { [Op.iLike]: `%${req.query.location}%` };
    }

    // Search by keyword
    if (req.query.keyword) {
      whereClause[Op.or] = [
        { title: { [Op.iLike]: `%${req.query.keyword}%` } },
        { description: { [Op.iLike]: `%${req.query.keyword}%` } },
        { location: { [Op.iLike]: `%${req.query.keyword}%` } },
      ];
    }

    // Get properties with pagination and count
    const { count, rows: properties } = await Property.findAndCountAll({
      where: whereClause,
      include: [
        {
          model: User,
          as: 'agent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatar'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: pageSize * (page - 1),
    });

    res.json({
      success: true,
      properties,
      page,
      pages: Math.ceil(count / pageSize),
      total: count,
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
  getProperties,
  getFeaturedProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
  getAgentProperties,
  getOffPlanProperties,
};
