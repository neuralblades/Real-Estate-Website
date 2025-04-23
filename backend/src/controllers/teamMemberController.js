const { TeamMember } = require('../models');
const { uploadToCloudinary } = require('../utils/cloudinary');

// @desc    Get all team members
// @route   GET /api/team
// @access  Public
const getTeamMembers = async (req, res) => {
  try {
    const teamMembers = await TeamMember.findAll({
      order: [
        ['isLeadership', 'DESC'],
        ['order', 'ASC'],
        ['name', 'ASC']
      ]
    });

    // Fix image paths for frontend
    const fixedTeamMembers = teamMembers.map(member => {
      const memberData = member.toJSON();

      // Fix image path if it's a local path
      if (memberData.image) {
        if (memberData.image.includes('C:')) {
          // Extract the relative path
          const pathParts = memberData.image.split('uploads');
          if (pathParts.length > 1) {
            const relativePath = pathParts[1].replace(/\\/g, '/');
            memberData.image = `http://localhost:5000/uploads${relativePath}`;
          }
        } else if (memberData.image.startsWith('/uploads')) {
          // Already a relative path, just add the backend URL
          memberData.image = `http://localhost:5000${memberData.image}`;
        }
      }

      return memberData;
    });

    res.json({
      success: true,
      teamMembers: fixedTeamMembers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get leadership team members
// @route   GET /api/team/leadership
// @access  Public
const getLeadershipTeam = async (req, res) => {
  try {
    const leadershipTeam = await TeamMember.findAll({
      where: { isLeadership: true },
      order: [
        ['order', 'ASC'],
        ['name', 'ASC']
      ]
    });

    // Fix image paths for frontend
    const fixedTeamMembers = leadershipTeam.map(member => {
      const memberData = member.toJSON();

      // Fix image path if it's a local path
      if (memberData.image) {
        if (memberData.image.includes('C:')) {
          // Extract the relative path
          const pathParts = memberData.image.split('uploads');
          if (pathParts.length > 1) {
            const relativePath = pathParts[1].replace(/\\/g, '/');
            memberData.image = `http://localhost:5000/uploads${relativePath}`;
          }
        } else if (memberData.image.startsWith('/uploads')) {
          // Already a relative path, just add the backend URL
          memberData.image = `http://localhost:5000${memberData.image}`;
        }
      }

      return memberData;
    });

    res.json({
      success: true,
      teamMembers: fixedTeamMembers
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Get a single team member
// @route   GET /api/team/:id
// @access  Public
const getTeamMemberById = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByPk(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    // Fix image path for frontend
    const memberData = teamMember.toJSON();

    // Fix image path if it's a local path
    if (memberData.image) {
      if (memberData.image.includes('C:')) {
        // Extract the relative path
        const pathParts = memberData.image.split('uploads');
        if (pathParts.length > 1) {
          const relativePath = pathParts[1].replace(/\\/g, '/');
          memberData.image = `http://localhost:5000/uploads${relativePath}`;
        }
      } else if (memberData.image.startsWith('/uploads')) {
        // Already a relative path, just add the backend URL
        memberData.image = `http://localhost:5000${memberData.image}`;
      }
    }

    res.json({
      success: true,
      teamMember: memberData
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Create a team member
// @route   POST /api/team
// @access  Private/Admin
const createTeamMember = async (req, res) => {
  try {
    const {
      name,
      role,
      bio,
      email,
      phone,
      social,
      specialties,
      isLeadership,
      order
    } = req.body;

    let imageUrl = null;

    // Handle image upload if provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      imageUrl = result.secure_url;
    }

    // Create team member
    const teamMember = await TeamMember.create({
      name,
      role,
      image: imageUrl,
      bio,
      email,
      phone,
      social: social ? JSON.parse(social) : { linkedin: '', twitter: '', instagram: '' },
      specialties: specialties ? JSON.parse(specialties) : [],
      isLeadership: isLeadership === 'true',
      order: order ? parseInt(order) : 0
    });

    res.status(201).json({
      success: true,
      message: 'Team member created successfully',
      teamMember
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Update a team member
// @route   PUT /api/team/:id
// @access  Private/Admin
const updateTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByPk(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    const {
      name,
      role,
      bio,
      email,
      phone,
      social,
      specialties,
      isLeadership,
      order
    } = req.body;

    // Handle image upload if provided
    if (req.file) {
      const result = await uploadToCloudinary(req.file.path);
      teamMember.image = result.secure_url;
    }

    // Update fields
    if (name) teamMember.name = name;
    if (role) teamMember.role = role;
    if (bio) teamMember.bio = bio;
    if (email) teamMember.email = email;
    if (phone) teamMember.phone = phone;
    if (social) teamMember.social = JSON.parse(social);
    if (specialties) teamMember.specialties = JSON.parse(specialties);
    if (isLeadership !== undefined) teamMember.isLeadership = isLeadership === 'true';
    if (order) teamMember.order = parseInt(order);

    await teamMember.save();

    res.json({
      success: true,
      message: 'Team member updated successfully',
      teamMember
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

// @desc    Delete a team member
// @route   DELETE /api/team/:id
// @access  Private/Admin
const deleteTeamMember = async (req, res) => {
  try {
    const teamMember = await TeamMember.findByPk(req.params.id);

    if (!teamMember) {
      return res.status(404).json({
        success: false,
        message: 'Team member not found'
      });
    }

    await teamMember.destroy();

    res.json({
      success: true,
      message: 'Team member removed'
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
};

module.exports = {
  getTeamMembers,
  getLeadershipTeam,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
};
