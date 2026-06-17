const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { upload } = require('../config/multer');

// Team routes
router.post('/add-team-member', upload.array('image', 7), teamController.addTeamMember);
router.get('/get-team-members', teamController.getTeamMembers);

module.exports = router;