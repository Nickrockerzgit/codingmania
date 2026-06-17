const express = require('express');
const router = express.Router();
const certificateController = require('../controllers/certificateController');
const { authenticateToken } = require('../middleware/auth');

// Get certificates for the logged-in user
router.get('/user', authenticateToken, certificateController.getUserCertificates);

module.exports = router;
