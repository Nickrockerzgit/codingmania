const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const profileController = require('../controllers/profileController');
const { profileUpload } = require('../utils/fileUpload');

// All profile routes require authentication
router.use(authenticateToken);
router.get('/', profileController.getProfile);
router.put('/update', profileController.updateProfile);
router.post(
  '/avatar',
  profileUpload.single('avatar'),
  (req, res, next) => {
    console.log("🔍 Middleware reached:");
    console.log("➡️  req.user:", req.user);
    console.log("➡️  req.file:", req.file);
    next(); 
  },
  profileController.uploadAvatar
);

router.put('/change-password', profileController.changePassword);

module.exports = router;