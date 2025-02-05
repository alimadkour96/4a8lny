const express = require('express');
const router = express.Router();
const {addQuestionToJob,getQuestionsForJob,addAnswerToQuestion,evaluateAnswer,getAnswersForQuestion,} = require('./Q&A.service');

// Add a question to a job
router.post('/jobs/:jobId/questions', async (req, res) => {
    try {
        const { companyId, questionText } = req.body;
        const question = await addQuestionToJob(req.params.jobId, companyId, questionText);
        res.status(201).json({ message: 'Question added successfully', question });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all questions for a job
router.get('/jobs/:jobId/questions', async (req, res) => {
    try {
        const questions = await getQuestionsForJob(req.params.jobId);
        res.status(200).json(questions);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Add an answer to a question
router.post('/questions/:questionId/answers', async (req, res) => {
    try {
        const { applicantId, answerText } = req.body;
        const answer = await addAnswerToQuestion(req.params.questionId, applicantId, answerText);
        res.status(201).json({ message: 'Answer added successfully', answer });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Evaluate an answer
router.put('/answers/:answerId/evaluate', async (req, res) => {
    try {
        const { isCorrect } = req.body;
        const answer = await evaluateAnswer(req.params.answerId, isCorrect);
        res.status(200).json({ message: 'Answer evaluated successfully', answer });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// Get all answers for a question
router.get('/questions/:questionId/answers', async (req, res) => {
    try {
        const answers = await getAnswersForQuestion(req.params.questionId);
        res.status(200).json(answers);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;