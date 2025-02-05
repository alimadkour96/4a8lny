// const {Schema,model,Types}= require('mongoose')
// const schema=Schema ({
//   questionText: { type: String, required: true },
//   answerOptions: [{ type: String }], // لو في خيارات إجابة
//   correctAnswer: { type: String }, // الإجابة الصحيحة
//   job: { type:Types.ObjectId, ref: 'Job', required: true }, // الوظيفة المرتبطة بالسؤال
//   createdAt: { type: Date, default: Date.now }

// })


// module.exports=model('question',schema)


// src/components/question/question.model.js

// const mongoose = require('mongoose');

// const questionSchema = new mongoose.Schema({
//   content: { type: String, required: true },
//   company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true },
//   job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
//   createdAt: { type: Date, default: Date.now }
// });

// const Question = mongoose.model('Question', questionSchema);

// module.exports = Question;

const mongoose = require('mongoose');

// Question Schema
const questionSchema = new mongoose.Schema({
    questionText: { type: String, required: true }, // The text of the question
    job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true }, // The job this question belongs to
    company: { type: mongoose.Schema.Types.ObjectId, ref: 'Company', required: true }, // The company that asked the question
    createdAt: { type: Date, default: Date.now }, // When the question was created
});

// Answer Schema
const answerSchema = new mongoose.Schema({
    answerText: { type: String, required: true }, // The text of the answer
    question: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true }, // The question this answer belongs to
    applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true }, // The applicant who answered
    isCorrect: { type: Boolean, default: null }, // Whether the answer is correct (null = not evaluated yet)
    createdAt: { type: Date, default: Date.now }, // When the answer was created
});

// Models
const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer', answerSchema);

module.exports = { Question, Answer };

