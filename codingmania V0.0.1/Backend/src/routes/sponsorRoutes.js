const express = require('express');
const router = express.Router();
const sponsorController = require('../controllers/sponsorController');
const { upload } = require('../config/multer');

// Sponsor routes
router.post('/add-sponsors', upload.array('logos', 10), sponsorController.addSponsors);
router.get('/get-sponsors', sponsorController.getSponsors);

// Per-sponsor CRUD (individual add / update / delete)
router.post('/add-sponsor', upload.single('logos'), sponsorController.addSponsor);
router.put('/update-sponsor/:id', upload.single('logos'), sponsorController.updateSponsor);
router.delete('/delete-sponsor/:id', sponsorController.deleteSponsor);

module.exports = router;