const { Question, Answer } = require('./Q&A.model');

// Add a question to a job
async function addQuestionToJob(jobId, companyId, questionText) {
    const question = new Question({questionText,job: jobId,company: companyId, });
    await question.save();
    return question;
}

// Get all questions for a job
async function getQuestionsForJob(jobId) {
    return await Question.find({ job: jobId });
}

// Add an answer to a question
async function addAnswerToQuestion(questionId, applicantId, answerText) {
    const answer = new Answer({
        answerText,
        question: questionId,
        applicant: applicantId,
    });
    await answer.save();
    return answer;
}

// Evaluate an answer (mark as correct or incorrect)
async function evaluateAnswer(answerId, isCorrect) {
    const answer = await Answer.findByIdAndUpdate(
        answerId,
        { isCorrect },
        { new: true }
    );
    return answer;
}

// Get all answers for a question
async function getAnswersForQuestion(questionId) {
    return await Answer.find({ question: questionId }).populate('applicant');
}

module.exports = {addQuestionToJob,getQuestionsForJob,addAnswerToQuestion,evaluateAnswer,getAnswersForQuestion,};
