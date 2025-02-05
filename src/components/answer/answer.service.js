const Answer = require('./answer.model');

const submitAnswer = async (req, res) => {
  try {
    const { questionId, response } = req.body;
    const employeeId = req.user.id;

    const answer = new Answer({
      question: questionId,
      employee: employeeId,
      response
    });

    await answer.save();
    res.status(201).json({ message: 'Answer submitted successfully', answer });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

const getAnswersByQuestion = async (req, res) => {
  try {
    const questionId = req.params.questionId;

    const answers = await Answer.find({ question: questionId }).populate('employee', 'name');
    res.json(answers);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { submitAnswer, getAnswersByQuestion };
