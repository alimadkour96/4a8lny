// src/components/answer/answer.api.js

const express = require('express');
const router = express.Router();
const answerService = require('./answer.service');

// Submit an answer
router.post('/', answerService.submitAnswer);

// Get all answers for a question
router.get('/question/:questionId', answerService.getAnswersByQuestion);

module.exports = router;
