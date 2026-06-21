// src/routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const notificationController = require('../controllers/notificationController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', authenticateToken, notificationController.getMyNotifications);
router.get('/unread-count', authenticateToken, notificationController.getUnreadCount);
router.put('/read-all', authenticateToken, notificationController.markAllAsRead);
router.put('/:id/read', authenticateToken, notificationController.markAsRead);

module.exports = router;
