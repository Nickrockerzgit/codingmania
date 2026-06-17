const express = require('express');
const router = express.Router();
const studentController = require('../controllers/studentController');
const roadmapController = require('../controllers/roadmapController');
const { authenticateToken } = require('../middleware/auth');

// All student routes require authentication
router.use(authenticateToken);

router.post('/tasks', studentController.createStudentTask);
router.get('/tasks', studentController.getStudentTasks);
router.put('/tasks/:id', studentController.updateStudentTask);
router.delete('/tasks/:id', studentController.deleteStudentTask);

router.get('/roadmaps', roadmapController.getAllRoadmaps);
router.get('/roadmaps/:roadmapId', roadmapController.getRoadmapById);
router.post('/roadmaps/:roadmapId/enrol', roadmapController.enrolInRoadmap);
router.patch('/roadmaps/:roadmapId/steps/:stepId/toggle', roadmapController.toggleStep);
router.get('/roadmaps/:roadmapId/progress', roadmapController.getStudentProgress);

// Profile routes - uses authenticated user from token
router.get('/profile', studentController.getStudentProfileByAuth);
router.put('/profile', studentController.updateStudentProfileByAuth);

module.exports = router;
