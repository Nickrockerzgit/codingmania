const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', jobController.getAllAlumniJobs);
router.post('/', authenticateToken, jobController.createAlumniJob);
router.get('/mine', authenticateToken, jobController.getMyAlumniJobs);
router.put('/:id', authenticateToken, jobController.updateAlumniJob);
router.delete('/:id', authenticateToken, jobController.deleteAlumniJob);

module.exports = router;
