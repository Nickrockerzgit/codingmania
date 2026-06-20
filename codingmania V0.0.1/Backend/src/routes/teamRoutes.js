const express = require('express');
const router = express.Router();
const teamController = require('../controllers/teamController');
const { upload } = require('../config/multer');

// Team routes
router.post('/add-team-member', upload.array('image', 20), teamController.addTeamMember); // bulk (legacy)
router.post('/save-member', upload.single('image'), teamController.saveTeamMember); // create/update one member
router.delete('/delete-member/:id', teamController.deleteTeamMember); // delete one member
router.get('/get-team-members', teamController.getTeamMembers);

module.exports = router;