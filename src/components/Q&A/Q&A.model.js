const mongoose = require('mongoose');

// Question Schema
const questionSchema = new mongoose.Schema({
    questionText: { 
        type: String, 
        required: [true, 'Question text is required'],
        trim: true,
        minlength: [10, 'Question must be at least 10 characters long'],
        maxlength: [500, 'Question cannot exceed 500 characters']
    },
    questionType: {
        type: String,
        enum: ['Multiple Choice', 'True/False', 'Short Answer', 'Essay', 'Technical'],
        default: 'Short Answer'
    },
    options: [{
        type: String,
        trim: true,
        maxlength: [200, 'Option cannot exceed 200 characters']
    }],
    correctAnswer: { 
        type: String,
        trim: true
    },
    points: {
        type: Number,
        min: [1, 'Points must be at least 1'],
        max: [100, 'Points cannot exceed 100'],
        default: 10
    },
    difficulty: {
        type: String,
        enum: ['Easy', 'Medium', 'Hard', 'Expert'],
        default: 'Medium'
    },
    category: {
        type: String,
        trim: true,
        required: [true, 'Question category is required']
    },
    job: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: [true, 'Job reference is required']
    },
    company: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: [true, 'Company reference is required']
    },
    isRequired: {
        type: Boolean,
        default: true
    },
    isActive: {
        type: Boolean,
        default: true
    },
    order: {
        type: Number,
        default: 0
    },
    estimatedTime: {
        type: Number, // in minutes
        min: [1, 'Estimated time must be at least 1 minute'],
        default: 5
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Answer Schema
const answerSchema = new mongoose.Schema({
    answerText: { 
        type: String, 
        required: [true, 'Answer text is required'],
        trim: true,
        maxlength: [2000, 'Answer cannot exceed 2000 characters']
    },
    question: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question', 
        required: [true, 'Question reference is required']
    },
    applicant: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Employee', 
        required: [true, 'Applicant reference is required']
    },
    application: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Application',
        required: [true, 'Application reference is required']
    },
    isCorrect: { 
        type: Boolean, 
        default: null 
    },
    score: {
        type: Number,
        min: [0, 'Score cannot be negative'],
        max: [100, 'Score cannot exceed 100']
    },
    feedback: {
        type: String,
        trim: true,
        maxlength: [500, 'Feedback cannot exceed 500 characters']
    },
    reviewedBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Admin'
    },
    reviewedAt: {
        type: Date
    },
    timeSpent: {
        type: Number, // in seconds
        min: [0, 'Time spent cannot be negative']
    },
    isSubmitted: {
        type: Boolean,
        default: false
    },
    submittedAt: {
        type: Date
    },
    createdAt: { 
        type: Date, 
        default: Date.now 
    },
    updatedAt: { 
        type: Date, 
        default: Date.now 
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Indexes for better query performance
questionSchema.index({ job: 1, isActive: 1 });
questionSchema.index({ company: 1, isActive: 1 });
questionSchema.index({ category: 1 });
questionSchema.index({ difficulty: 1 });
questionSchema.index({ questionText: 'text', category: 'text' });
questionSchema.index({ order: 1 });

answerSchema.index({ question: 1, applicant: 1 });
answerSchema.index({ application: 1 });
answerSchema.index({ isCorrect: 1 });
answerSchema.index({ isSubmitted: 1 });
answerSchema.index({ createdAt: -1 });

// Virtual for question display
questionSchema.virtual('questionDisplay').get(function() {
    if (this.questionType === 'Multiple Choice' && this.options.length > 0) {
        return `${this.questionText}\n\nOptions:\n${this.options.map((opt, index) => `${String.fromCharCode(65 + index)}. ${opt}`).join('\n')}`;
    }
    return this.questionText;
});

// Virtual for answer status
answerSchema.virtual('status').get(function() {
    if (this.isCorrect === null) return 'Pending Review';
    if (this.isCorrect) return 'Correct';
    return 'Incorrect';
});

// Pre-save middleware for questions
questionSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    // Validate multiple choice questions have options
    if (this.questionType === 'Multiple Choice' && (!this.options || this.options.length < 2)) {
        return next(new Error('Multiple choice questions must have at least 2 options'));
    }
    
    // Validate correct answer exists for multiple choice
    if (this.questionType === 'Multiple Choice' && this.correctAnswer && !this.options.includes(this.correctAnswer)) {
        return next(new Error('Correct answer must be one of the provided options'));
    }
    
    next();
});

// Pre-save middleware for answers
answerSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    if (this.isSubmitted && !this.submittedAt) {
        this.submittedAt = Date.now();
    }
    
    next();
});

// Instance method to evaluate answer
answerSchema.methods.evaluate = function(adminId, isCorrect, score, feedback = '') {
    this.isCorrect = isCorrect;
    this.score = score;
    this.feedback = feedback;
    this.reviewedBy = adminId;
    this.reviewedAt = Date.now();
    return this.save();
};

// Instance method to submit answer
answerSchema.methods.submit = function() {
    this.isSubmitted = true;
    this.submittedAt = Date.now();
    return this.save();
};

// Static method to find questions by job
questionSchema.statics.findByJob = function(jobId) {
    return this.find({ job: jobId, isActive: true }).sort({ order: 1 });
};

// Static method to find questions by company
questionSchema.statics.findByCompany = function(companyId) {
    return this.find({ company: companyId, isActive: true }).sort({ order: 1 });
};

// Static method to find questions by category
questionSchema.statics.findByCategory = function(category) {
    return this.find({ category: category, isActive: true }).sort({ order: 1 });
};

// Static method to find answers by application
answerSchema.statics.findByApplication = function(applicationId) {
    return this.find({ application: applicationId }).populate('question');
};

// Static method to find pending answers
answerSchema.statics.findPending = function() {
    return this.find({ isCorrect: null, isSubmitted: true }).populate('question applicant');
};

// Static method to find answers by question
answerSchema.statics.findByQuestion = function(questionId) {
    return this.find({ question: questionId }).populate('applicant application');
};

// Models
const Question = mongoose.model('Question', questionSchema);
const Answer = mongoose.model('Answer', answerSchema);

module.exports = { Question, Answer };

