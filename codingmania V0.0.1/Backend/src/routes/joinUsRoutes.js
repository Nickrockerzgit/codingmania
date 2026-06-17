const express = require('express');
const router = express.Router();
const joinUsController = require('../controllers/joinUsController');
const { authenticateToken, requireAdminCapability, requireSuperAdmin } = require('../middleware/auth');

router.post('/', authenticateToken, joinUsController.joinUs);
router.get('/data', authenticateToken, requireAdminCapability, joinUsController.getJoinUsData);
router.patch('/:id/approve', authenticateToken, requireAdminCapability, joinUsController.approveJoinUsRequest);
router.patch('/:id/reject', authenticateToken, requireAdminCapability, joinUsController.rejectJoinUsRequest);
router.get('/admin-members', authenticateToken, requireAdminCapability, joinUsController.getAdminMembers);
router.delete('/admin-members/:userId', authenticateToken, requireSuperAdmin, joinUsController.removeAdminCapability);

module.exports = router;
