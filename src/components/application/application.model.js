const mongoose = require('mongoose');

const applicationSchema = new mongoose.Schema({
    job: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job', 
        required: [true, 'Job reference is required']
    },
    employee: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Employee', 
        required: [true, 'Employee reference is required']
    },
    cv: { 
        type: String,
        trim: true,
        match: [/^https?:\/\/.+/, 'Please enter a valid CV URL']
    },
    portfolio: { 
        type: String,
        trim: true,
        match: [/^https?:\/\/.+/, 'Please enter a valid portfolio URL']
    },
    coverLetter: {
        type: String,
        trim: true,
        maxlength: [2000, 'Cover letter cannot exceed 2000 characters']
    },
    answers: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Answer' 
    }],
    expectedSalary: { 
        type: Number,
        min: [0, 'Expected salary cannot be negative']
    },
    status: { 
        type: String, 
        enum: ['Pending', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Rejected', 'Withdrawn', 'Hired'], 
        default: 'Pending'
    },
    applicationScore: {
        type: Number,
        min: [0, 'Application score cannot be negative'],
        max: [100, 'Application score cannot exceed 100']
    },
    reviewNotes: [{
        reviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin',
            required: true
        },
        note: {
            type: String,
            trim: true,
            maxlength: [500, 'Review note cannot exceed 500 characters']
        },
        rating: {
            type: Number,
            min: [1, 'Rating must be at least 1'],
            max: [5, 'Rating cannot exceed 5']
        },
        createdAt: {
            type: Date,
            default: Date.now
        }
    }],
    interviewDetails: {
        scheduledDate: {
            type: Date
        },
        interviewType: {
            type: String,
            enum: ['Phone', 'Video', 'In-person', 'Technical Test'],
            default: 'Video'
        },
        interviewer: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        location: {
            type: String,
            trim: true
        },
        notes: {
            type: String,
            trim: true,
            maxlength: [1000, 'Interview notes cannot exceed 1000 characters']
        }
    },
    timeline: [{
        action: {
            type: String,
            required: true,
            enum: ['Applied', 'Under Review', 'Shortlisted', 'Interview Scheduled', 'Interview Completed', 'Rejected', 'Hired', 'Withdrawn']
        },
        timestamp: {
            type: Date,
            default: Date.now
        },
        performedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Admin'
        },
        notes: {
            type: String,
            trim: true
        }
    }],
    isActive: {
        type: Boolean,
        default: true
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
applicationSchema.index({ job: 1, employee: 1 }, { unique: true }); // Prevent duplicate applications
applicationSchema.index({ status: 1, createdAt: -1 });
applicationSchema.index({ employee: 1, status: 1 });
applicationSchema.index({ job: 1, status: 1 });
applicationSchema.index({ 'interviewDetails.scheduledDate': 1 });
applicationSchema.index({ applicationScore: -1 });
applicationSchema.index({ createdAt: -1 });

// Virtual for application age
applicationSchema.virtual('applicationAge').get(function() {
    const now = new Date();
    const diff = now - this.createdAt;
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    
    if (days === 0) return 'Today';
    if (days === 1) return 'Yesterday';
    if (days < 7) return `${days} days ago`;
    if (days < 30) return `${Math.floor(days / 7)} weeks ago`;
    if (days < 365) return `${Math.floor(days / 30)} months ago`;
    return `${Math.floor(days / 365)} years ago`;
});

// Virtual for status color
applicationSchema.virtual('statusColor').get(function() {
    const statusColors = {
        'Pending': 'warning',
        'Under Review': 'info',
        'Shortlisted': 'primary',
        'Interview Scheduled': 'success',
        'Interview Completed': 'info',
        'Rejected': 'danger',
        'Withdrawn': 'secondary',
        'Hired': 'success'
    };
    return statusColors[this.status] || 'secondary';
});

// Pre-save middleware to update timestamps and add timeline entry
applicationSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    // Add timeline entry if status changed
    if (this.isModified('status') && this.timeline) {
        this.timeline.push({
            action: this.status,
            timestamp: Date.now(),
            notes: `Status changed to ${this.status}`
        });
    }
    
    next();
});

// Instance method to update status
applicationSchema.methods.updateStatus = function(newStatus, adminId, notes = '') {
    this.status = newStatus;
    this.timeline.push({
        action: newStatus,
        timestamp: Date.now(),
        performedBy: adminId,
        notes: notes
    });
    return this.save();
};

// Instance method to schedule interview
applicationSchema.methods.scheduleInterview = function(interviewData, adminId) {
    this.interviewDetails = interviewData;
    this.status = 'Interview Scheduled';
    this.timeline.push({
        action: 'Interview Scheduled',
        timestamp: Date.now(),
        performedBy: adminId,
        notes: `Interview scheduled for ${interviewData.scheduledDate}`
    });
    return this.save();
};

// Instance method to add review note
applicationSchema.methods.addReviewNote = function(reviewerId, note, rating) {
    this.reviewNotes.push({
        reviewer: reviewerId,
        note: note,
        rating: rating
    });
    
    // Calculate average rating
    if (this.reviewNotes.length > 0) {
        const totalRating = this.reviewNotes.reduce((sum, review) => sum + review.rating, 0);
        this.applicationScore = Math.round(totalRating / this.reviewNotes.length * 20); // Convert to 0-100 scale
    }
    
    return this.save();
};

// Instance method to withdraw application
applicationSchema.methods.withdraw = function() {
    this.status = 'Withdrawn';
    this.isActive = false;
    this.timeline.push({
        action: 'Withdrawn',
        timestamp: Date.now(),
        notes: 'Application withdrawn by applicant'
    });
    return this.save();
};

// Static method to find applications by status
applicationSchema.statics.findByStatus = function(status) {
    return this.find({ status: status, isActive: true });
};

// Static method to find applications by employee
applicationSchema.statics.findByEmployee = function(employeeId) {
    return this.find({ employee: employeeId, isActive: true }).populate('job');
};

// Static method to find applications by job
applicationSchema.statics.findByJob = function(jobId) {
    return this.find({ job: jobId, isActive: true }).populate('employee');
};

// Static method to find pending applications
applicationSchema.statics.findPending = function() {
    return this.find({ 
        status: { $in: ['Pending', 'Under Review'] }, 
        isActive: true 
    }).populate('job employee');
};

// Static method to find applications requiring review
applicationSchema.statics.findRequiringReview = function() {
    return this.find({ 
        status: { $in: ['Pending', 'Under Review'] }, 
        isActive: true 
    }).populate('job employee');
};

module.exports = mongoose.model('Application', applicationSchema);
