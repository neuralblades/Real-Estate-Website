const express = require('express');
const router = express.Router();
const {
  sendMessage,
  getInquiryMessages,
  getUserConversations,
  markMessagesAsRead,
  getUnreadMessageCount,
} = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware');

// All routes are protected
router.use(protect);

// Message routes
router.post('/', sendMessage);
router.get('/inquiry/:id', getInquiryMessages);
router.get('/conversations', getUserConversations);
router.put('/read', markMessagesAsRead);
router.get('/unread', getUnreadMessageCount);

module.exports = router;
