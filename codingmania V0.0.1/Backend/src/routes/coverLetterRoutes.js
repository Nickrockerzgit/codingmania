





const express = require('express');
const { generateCoverLetter } = require('../controllers/coverLetterController');

const router = express.Router();

// POST /api/generate-cover-letter
router.post('/generate-cover-letter', generateCoverLetter);

module.exports = router;
