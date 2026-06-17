



// src/routes/userlistRoutes.js   ← yeh final version rakh

const express = require('express');
const router = express.Router();

const userlistController = require('../controllers/userlistController');
const { authenticateToken } = require('../middleware/auth');

router.get('/count', userlistController.getUserCount);
router.get('/', userlistController.getAllUsers);
router.post('/apply', authenticateToken, userlistController.applyForRole);
router.get('/me', authenticateToken, userlistController.getCurrentUser);
router.put('/profile', authenticateToken, userlistController.updateProfile);

module.exports = router;