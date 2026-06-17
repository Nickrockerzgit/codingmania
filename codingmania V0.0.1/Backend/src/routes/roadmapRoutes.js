const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const roadmapController = require('../controllers/roadmapController');

router.get('/', roadmapController.getAllRoadmaps);
router.get('/my-roadmaps', authenticateToken, roadmapController.getMyRoadmaps);
router.get('/:id', roadmapController.getRoadmapById);
router.get('/:id/students', authenticateToken, roadmapController.getEnrolledStudents);

router.post('/', authenticateToken, roadmapController.createRoadmap);
router.put('/:id', authenticateToken, roadmapController.updateRoadmap);
router.delete('/:id', authenticateToken, roadmapController.deleteRoadmap);

router.post('/:id/enroll', authenticateToken, roadmapController.enrolInRoadmap);
router.post('/:id/steps/:stepId/toggle', authenticateToken, roadmapController.toggleStep);

module.exports = router;