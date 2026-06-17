const express = require('express');
const router = express.Router();
const alumniController = require('../controllers/alumniController');
const roadmapController = require('../controllers/roadmapController');
const { authenticateToken } = require('../middleware/auth');

router.get('/', alumniController.getAllAlumni);
router.post('/tasks', alumniController.createAlumniTask);
router.get('/tasks', alumniController.getAlumniTasks);
router.put('/tasks/:id', alumniController.updateAlumniTask);
router.delete('/tasks/:id', alumniController.deleteAlumniTask);

router.get('/profile', alumniController.getAlumniProfile);
router.put('/profile', alumniController.updateAlumniProfile);

router.get('/roadmaps/analytics', authenticateToken, roadmapController.getAnalytics);
router.post('/roadmaps', authenticateToken, roadmapController.createRoadmap);
router.get('/roadmaps', authenticateToken, roadmapController.getAllRoadmaps);
router.get('/roadmaps/my-roadmaps', authenticateToken, roadmapController.getMyRoadmaps);
router.get('/roadmaps/:roadmapId', authenticateToken, roadmapController.getRoadmapById);
router.get('/roadmaps/:roadmapId/students', authenticateToken, roadmapController.getEnrolledStudents);
router.put('/roadmaps/:roadmapId', authenticateToken, roadmapController.updateRoadmap);
router.delete('/roadmaps/:roadmapId', authenticateToken, roadmapController.deleteRoadmap);
router.get('/roadmaps-mine', authenticateToken, roadmapController.getMyRoadmaps);

module.exports = router;
