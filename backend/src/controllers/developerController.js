const { Developer, Property, User } = require('../models');
const slugify = require('slugify');

// @desc    Get all developers
// @route   GET /api/developers
// @access  Public
const getDevelopers = async (req, res) => {
  try {
    const developers = await Developer.findAll({
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      developers,
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

// @desc    Get featured developers
// @route   GET /api/developers/featured
// @access  Public
const getFeaturedDevelopers = async (req, res) => {
  try {
    const developers = await Developer.findAll({
      where: { featured: true },
      order: [['name', 'ASC']],
    });

    res.json({
      success: true,
      developers,
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

// @desc    Get developer by ID
// @route   GET /api/developers/:id
// @access  Public
const getDeveloperById = async (req, res) => {
  try {
    const developer = await Developer.findByPk(req.params.id);

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found',
      });
    }

    res.json({
      success: true,
      developer,
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

// @desc    Get developer by slug
// @route   GET /api/developers/slug/:slug
// @access  Public
const getDeveloperBySlug = async (req, res) => {
  try {
    const developer = await Developer.findOne({
      where: { slug: req.params.slug },
    });

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found',
      });
    }

    res.json({
      success: true,
      developer,
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

// @desc    Get developer properties
// @route   GET /api/developers/:id/properties
// @access  Public
const getDeveloperProperties = async (req, res) => {
  try {
    const pageSize = 9;
    const page = Number(req.query.page) || 1;

    const { count, rows: properties } = await Property.findAndCountAll({
      where: { developerId: req.params.id },
      include: [
        {
          model: User,
          as: 'agent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatar'],
        },
        {
          model: Developer,
          as: 'developer',
          attributes: ['id', 'name', 'logo', 'slug'],
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

// @desc    Get developer properties by slug
// @route   GET /api/developers/slug/:slug/properties
// @access  Public
const getDeveloperPropertiesBySlug = async (req, res) => {
  try {
    const developer = await Developer.findOne({
      where: { slug: req.params.slug },
    });

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found',
      });
    }

    const pageSize = 9;
    const page = Number(req.query.page) || 1;

    const { count, rows: properties } = await Property.findAndCountAll({
      where: { developerId: developer.id },
      include: [
        {
          model: User,
          as: 'agent',
          attributes: ['id', 'firstName', 'lastName', 'email', 'phone', 'avatar'],
        },
        {
          model: Developer,
          as: 'developer',
          attributes: ['id', 'name', 'logo', 'slug'],
        },
      ],
      order: [['createdAt', 'DESC']],
      limit: pageSize,
      offset: pageSize * (page - 1),
    });

    res.json({
      success: true,
      developer,
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

// @desc    Create a new developer
// @route   POST /api/developers
// @access  Private/Admin
const createDeveloper = async (req, res) => {
  try {
    const {
      name,
      description,
      website,
      established,
      headquarters,
      featured,
    } = req.body;

    // Process logo
    let logo = '';
    if (req.file) {
      logo = `/uploads/${req.file.filename}`;
    }

    // Create slug from name
    const slug = slugify(name, { lower: true });

    // Check if developer with this name already exists
    const existingDeveloper = await Developer.findOne({
      where: { name },
    });

    if (existingDeveloper) {
      return res.status(400).json({
        success: false,
        message: 'Developer with this name already exists',
      });
    }

    // Create developer
    const developer = await Developer.create({
      name,
      description,
      logo,
      website,
      established,
      headquarters,
      featured: featured === 'true' || featured === true,
      slug,
    });

    res.status(201).json({
      success: true,
      developer,
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

// @desc    Update a developer
// @route   PUT /api/developers/:id
// @access  Private/Admin
const updateDeveloper = async (req, res) => {
  try {
    const developer = await Developer.findByPk(req.params.id);

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found',
      });
    }

    const {
      name,
      description,
      website,
      established,
      headquarters,
      featured,
    } = req.body;

    // Process logo if a new one is uploaded
    let logo = developer.logo;
    if (req.file) {
      logo = `/uploads/${req.file.filename}`;
    }

    // Update slug if name is changed
    let slug = developer.slug;
    if (name && name !== developer.name) {
      slug = slugify(name, { lower: true });
    }

    // Update developer
    await developer.update({
      name: name || developer.name,
      description: description || developer.description,
      logo,
      website: website || developer.website,
      established: established || developer.established,
      headquarters: headquarters || developer.headquarters,
      featured: featured === 'true' || featured === true,
      slug,
    });

    res.json({
      success: true,
      developer,
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

// @desc    Delete a developer
// @route   DELETE /api/developers/:id
// @access  Private/Admin
const deleteDeveloper = async (req, res) => {
  try {
    const developer = await Developer.findByPk(req.params.id);

    if (!developer) {
      return res.status(404).json({
        success: false,
        message: 'Developer not found',
      });
    }

    // Check if developer has properties
    const properties = await Property.findAll({
      where: { developerId: developer.id },
    });

    if (properties.length > 0) {
      return res.status(400).json({
        success: false,
        message: 'Cannot delete developer with associated properties',
      });
    }

    await developer.destroy();

    res.json({
      success: true,
      message: 'Developer removed',
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
  getDevelopers,
  getFeaturedDevelopers,
  getDeveloperById,
  getDeveloperBySlug,
  getDeveloperProperties,
  getDeveloperPropertiesBySlug,
  createDeveloper,
  updateDeveloper,
  deleteDeveloper,
};
