const { Message, User, Inquiry, Property } = require('../models');
const { Op } = require('sequelize');

// @desc    Send a new message
// @route   POST /api/messages
// @access  Private
const sendMessage = async (req, res) => {
  try {
    const { inquiryId, content, receiverId } = req.body;
    const senderId = req.user.id;

    // Validate required fields
    if (!inquiryId || !content || !receiverId) {
      return res.status(400).json({
        success: false,
        message: 'Missing required fields',
      });
    }

    // Check if inquiry exists
    const inquiry = await Inquiry.findByPk(inquiryId, {
      include: [
        {
          model: Property,
          as: 'property',
          include: [
            {
              model: User,
              as: 'agent',
              attributes: ['id'],
            },
          ],
        },
      ],
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    // Check if user is authorized to send message
    // User must be either the inquiry creator, the property agent, or an admin
    const isInquiryCreator = inquiry.userId === senderId;
    const isPropertyAgent = inquiry.property.agentId === senderId;
    const isAdmin = req.user.role === 'admin';

    if (!isInquiryCreator && !isPropertyAgent && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to send message for this inquiry',
      });
    }

    // Create message
    const message = await Message.create({
      inquiryId,
      content,
      senderId,
      receiverId,
      isRead: false,
    });

    // Get the message with sender details
    const messageWithDetails = await Message.findByPk(message.id, {
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'role'],
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'role'],
        },
        {
          model: Inquiry,
          as: 'inquiry',
          include: [
            {
              model: Property,
              as: 'property',
              attributes: ['id', 'title', 'mainImage'],
            },
          ],
        },
      ],
    });

    // Update inquiry status to in-progress if it's new
    if (inquiry.status === 'new') {
      await inquiry.update({ status: 'in-progress' });
    }

    res.status(201).json({
      success: true,
      message: messageWithDetails,
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

// @desc    Get messages for an inquiry
// @route   GET /api/messages/inquiry/:id
// @access  Private
const getInquiryMessages = async (req, res) => {
  try {
    const inquiryId = req.params.id;
    
    // Check if inquiry exists
    const inquiry = await Inquiry.findByPk(inquiryId, {
      include: [
        {
          model: Property,
          as: 'property',
          include: [
            {
              model: User,
              as: 'agent',
              attributes: ['id'],
            },
          ],
        },
      ],
    });

    if (!inquiry) {
      return res.status(404).json({
        success: false,
        message: 'Inquiry not found',
      });
    }

    // Check if user is authorized to view messages
    // User must be either the inquiry creator, the property agent, or an admin
    const isInquiryCreator = inquiry.userId === req.user.id;
    const isPropertyAgent = inquiry.property.agentId === req.user.id;
    const isAdmin = req.user.role === 'admin';

    if (!isInquiryCreator && !isPropertyAgent && !isAdmin) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view messages for this inquiry',
      });
    }

    // Get messages
    const messages = await Message.findAll({
      where: { inquiryId },
      include: [
        {
          model: User,
          as: 'sender',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'role'],
        },
        {
          model: User,
          as: 'receiver',
          attributes: ['id', 'firstName', 'lastName', 'email', 'avatar', 'role'],
        },
      ],
      order: [['createdAt', 'ASC']],
    });

    // Mark messages as read if user is the receiver
    const unreadMessages = messages.filter(
      (message) => !message.isRead && message.receiverId === req.user.id
    );

    if (unreadMessages.length > 0) {
      await Promise.all(
        unreadMessages.map((message) => message.update({ isRead: true }))
      );
    }

    res.json({
      success: true,
      messages,
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

// @desc    Get all user's conversations
// @route   GET /api/messages/conversations
// @access  Private
const getUserConversations = async (req, res) => {
  try {
    const userId = req.user.id;

    // Find all inquiries where the user is involved
    let inquiries = [];
    
    if (req.user.role === 'agent') {
      // For agents, get inquiries for their properties
      const agentProperties = await Property.findAll({
        where: { agentId: userId },
        attributes: ['id'],
      });
      
      const propertyIds = agentProperties.map(property => property.id);
      
      inquiries = await Inquiry.findAll({
        where: { propertyId: { [Op.in]: propertyIds } },
        include: [
          {
            model: Property,
            as: 'property',
            attributes: ['id', 'title', 'mainImage'],
            include: [
              {
                model: User,
                as: 'agent',
                attributes: ['id', 'firstName', 'lastName', 'avatar'],
              },
            ],
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
          },
        ],
        order: [['updatedAt', 'DESC']],
      });
    } else if (req.user.role === 'admin') {
      // For admins, get all inquiries
      inquiries = await Inquiry.findAll({
        include: [
          {
            model: Property,
            as: 'property',
            attributes: ['id', 'title', 'mainImage'],
            include: [
              {
                model: User,
                as: 'agent',
                attributes: ['id', 'firstName', 'lastName', 'avatar'],
              },
            ],
          },
          {
            model: User,
            as: 'user',
            attributes: ['id', 'firstName', 'lastName', 'email', 'avatar'],
          },
        ],
        order: [['updatedAt', 'DESC']],
      });
    } else {
      // For regular users, get inquiries they created
      inquiries = await Inquiry.findAll({
        where: { userId },
        include: [
          {
            model: Property,
            as: 'property',
            attributes: ['id', 'title', 'mainImage'],
            include: [
              {
                model: User,
                as: 'agent',
                attributes: ['id', 'firstName', 'lastName', 'avatar'],
              },
            ],
          },
        ],
        order: [['updatedAt', 'DESC']],
      });
    }

    // Get the latest message and unread count for each inquiry
    const conversations = await Promise.all(
      inquiries.map(async (inquiry) => {
        const latestMessage = await Message.findOne({
          where: { inquiryId: inquiry.id },
          order: [['createdAt', 'DESC']],
          include: [
            {
              model: User,
              as: 'sender',
              attributes: ['id', 'firstName', 'lastName'],
            },
          ],
        });

        const unreadCount = await Message.count({
          where: {
            inquiryId: inquiry.id,
            receiverId: userId,
            isRead: false,
          },
        });

        return {
          inquiry,
          latestMessage,
          unreadCount,
        };
      })
    );

    res.json({
      success: true,
      conversations,
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

// @desc    Mark messages as read
// @route   PUT /api/messages/read
// @access  Private
const markMessagesAsRead = async (req, res) => {
  try {
    const { messageIds } = req.body;
    
    if (!messageIds || !Array.isArray(messageIds) || messageIds.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No message IDs provided',
      });
    }

    // Find messages
    const messages = await Message.findAll({
      where: {
        id: { [Op.in]: messageIds },
        receiverId: req.user.id,
      },
    });

    if (messages.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No valid messages found',
      });
    }

    // Update messages
    await Promise.all(
      messages.map((message) => message.update({ isRead: true }))
    );

    res.json({
      success: true,
      message: `${messages.length} messages marked as read`,
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

// @desc    Get unread message count
// @route   GET /api/messages/unread
// @access  Private
const getUnreadMessageCount = async (req, res) => {
  try {
    const userId = req.user.id;

    const unreadCount = await Message.count({
      where: {
        receiverId: userId,
        isRead: false,
      },
    });

    res.json({
      success: true,
      unreadCount,
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
  sendMessage,
  getInquiryMessages,
  getUserConversations,
  markMessagesAsRead,
  getUnreadMessageCount,
};
