const express = require('express');
const router = express.Router();
const sponsorController = require('../controllers/sponsorController');
const { upload } = require('../config/multer');

// Sponsor routes
router.post('/add-sponsors', upload.array('logos', 10), sponsorController.addSponsors);
router.get('/get-sponsors', sponsorController.getSponsors);

module.exports = router;