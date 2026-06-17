const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizeController');

router.post('/generate-quiz', quizController.getQuizQuestions);

module.exports = router;