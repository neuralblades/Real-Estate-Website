const express = require('express');
const router = express.Router();
const { protect, admin } = require('../middleware/authMiddleware');
const upload = require('../middleware/uploadMiddleware');
const {
  getTeamMembers,
  getLeadershipTeam,
  getTeamMemberById,
  createTeamMember,
  updateTeamMember,
  deleteTeamMember
} = require('../controllers/teamMemberController');

// Public routes
router.get('/', getTeamMembers);
router.get('/leadership', getLeadershipTeam);
router.get('/:id', getTeamMemberById);

// Admin routes
router.post('/', protect, admin, upload.single('image'), createTeamMember);
router.put('/:id', protect, admin, upload.single('image'), updateTeamMember);
router.delete('/:id', protect, admin, deleteTeamMember);

module.exports = router;
