// src/routes/webinarsRoutes.js

const express = require('express');
const router = express.Router();
const webinarController = require('../controllers/webinarController');
const { authenticateToken } = require('../middleware/auth');

// NOTE: keep specific string routes (/user, /attendance) BEFORE the
// parameterized /:id routes, otherwise Express matches them as an :id.

// List all webinars
router.get('/', authenticateToken, webinarController.getAllWebinars);

// Admin create webinar
router.post('/', authenticateToken, webinarController.createWebinar); // Add admin check if needed

// User get their events (webinars)
router.get('/user', authenticateToken, webinarController.getUserWebinars);

// Admin update attendance status (attended / missed)
router.put('/attendance', authenticateToken, webinarController.updateAttendance);

// User registration
router.post('/:id/register', authenticateToken, webinarController.registerForWebinar);

// Admin get attendances for a webinar
router.get('/:id/attendances', authenticateToken, webinarController.getWebinarAttendances);

// Admin update / delete webinar
router.put('/:id', authenticateToken, webinarController.updateWebinar);
router.delete('/:id', authenticateToken, webinarController.deleteWebinar);

module.exports = router;
