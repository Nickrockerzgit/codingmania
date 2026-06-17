const express = require('express');
const { generateGeminiResponse } = require('../controllers/resumeAIController');

const router = express.Router();

router.post('/generate-gemini', generateGeminiResponse);

module.exports = router;
