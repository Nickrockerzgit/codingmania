const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', eventController.getAllAlumniEvents);
router.post('/', authenticateToken, eventController.createAlumniEvent);
router.get('/mine', authenticateToken, eventController.getMyAlumniEvents);
router.put('/:id', authenticateToken, eventController.updateAlumniEvent);
router.delete('/:id', authenticateToken, eventController.deleteAlumniEvent);

module.exports = router;