



// src/routes/userlistRoutes.js   ← yeh final version rakh

const express = require('express');
const router = express.Router();

const userlistController = require('../controllers/userlistController');
const { authenticateToken } = require('../middleware/auth');

router.get('/count', userlistController.getUserCount);

// Admin user management (students + alumni)
router.get('/managed', authenticateToken, userlistController.getManagedUsers);
router.put('/:id/block', authenticateToken, userlistController.toggleBlockUser);
router.post('/:id/assign-task', authenticateToken, userlistController.assignTask);

router.get('/', userlistController.getAllUsers);
router.post('/apply', authenticateToken, userlistController.applyForRole);
router.post('/set-roll', authenticateToken, userlistController.setRollNumber);
router.get('/me', authenticateToken, userlistController.getCurrentUser);
router.put('/profile', authenticateToken, userlistController.updateProfile);

module.exports = router;