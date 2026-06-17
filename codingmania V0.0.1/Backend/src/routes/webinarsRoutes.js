// src/routes/webinarsRoutes.js

const express = require('express');
const router = express.Router();
const webinarController = require('../controllers/webinarController');
const { authenticateToken } = require('../middleware/auth');

// Admin routes (assume admin middleware if needed, but for simplicity using authenticateToken)
router.get('/', authenticateToken, webinarController.getAllWebinars);
router.post('/', authenticateToken, webinarController.createWebinar); // Add admin check if needed

// User registration
router.post('/:id/register', authenticateToken, webinarController.registerForWebinar);

// Admin update attendance
router.put('/attendance', authenticateToken, webinarController.updateAttendance); // Add admin check

// User get their events (webinars)
router.get('/user', authenticateToken, webinarController.getUserWebinars);

// Admin get attendances for a webinar
router.get('/:id/attendances', authenticateToken, webinarController.getWebinarAttendances);

module.exports = router;