const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
    title: { 
        type: String, 
        required: [true, 'Job title is required'],
        trim: true,
        minlength: [3, 'Job title must be at least 3 characters long'],
        maxlength: [100, 'Job title cannot exceed 100 characters']
    },
    description: { 
        type: String, 
        required: [true, 'Job description is required'],
        trim: true,
        minlength: [50, 'Job description must be at least 50 characters long'],
        maxlength: [2000, 'Job description cannot exceed 2000 characters']
    },
    company: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Company', 
        required: [true, 'Company reference is required']
    },
    requiredSkills: [{ 
        type: String,
        trim: true,
        minlength: [2, 'Skill must be at least 2 characters long']
    }],
    questions: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Question' 
    }],
    applicants: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Employee' 
    }],
    salaryRange: { 
        min: { 
            type: Number, 
            required: [true, 'Minimum salary is required'],
            min: [0, 'Minimum salary cannot be negative']
        },
        max: { 
            type: Number, 
            required: [true, 'Maximum salary is required'],
            min: [0, 'Maximum salary cannot be negative']
        }
    },
    jobType: { 
        type: String, 
        enum: ['Full-time', 'Part-time', 'Freelance', 'Contract', 'Internship'], 
        required: [true, 'Job type is required'],
        default: 'Full-time'
    },
    experienceLevel: { 
        type: String, 
        enum: ['Entry', 'Junior', 'Mid', 'Senior', 'Lead', 'Executive'], 
        required: [true, 'Experience level is required'],
        default: 'Junior'
    },
    location: {
        type: String,
        required: [true, 'Job location is required'],
        trim: true
    },
    isRemote: {
        type: Boolean,
        default: false
    },
    benefits: [{
        type: String,
        trim: true
    }],
    requirements: {
        education: {
            type: String,
            enum: ['High School', 'Bachelor', 'Master', 'PhD', 'Any'],
            default: 'Any'
        },
        yearsOfExperience: {
            type: Number,
            min: [0, 'Years of experience cannot be negative'],
            default: 0
        },
        certifications: [{
            type: String,
            trim: true
        }]
    },
    applicationDeadline: {
        type: Date,
        default: function() {
            return new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30 days from now
        }
    },
    isActive: { 
        type: Boolean, 
        default: true 
    },
    isUrgent: {
        type: Boolean,
        default: false
    },
    views: {
        type: Number,
        default: 0
    },
    applicationsCount: {
        type: Number,
        default: 0
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
jobSchema.index({ company: 1, isActive: 1 });
jobSchema.index({ jobType: 1, experienceLevel: 1 });
jobSchema.index({ location: 1 });
jobSchema.index({ requiredSkills: 1 });
jobSchema.index({ 'salaryRange.min': 1, 'salaryRange.max': 1 });
jobSchema.index({ isActive: 1, isUrgent: 1 });
jobSchema.index({ title: 'text', description: 'text', requiredSkills: 'text' });
jobSchema.index({ applicationDeadline: 1 });
jobSchema.index({ createdAt: -1 });

// Virtual for application status
jobSchema.virtual('isExpired').get(function() {
    return this.applicationDeadline < new Date();
});

// Virtual for salary range display
jobSchema.virtual('salaryDisplay').get(function() {
    if (this.salaryRange.min === this.salaryRange.max) {
        return `$${this.salaryRange.min.toLocaleString()}`;
    }
    return `$${this.salaryRange.min.toLocaleString()} - $${this.salaryRange.max.toLocaleString()}`;
});

// Virtual for time since posting
jobSchema.virtual('timeSincePosted').get(function() {
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

// Pre-save middleware to update timestamps
jobSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    
    // Validate salary range
    if (this.salaryRange.min > this.salaryRange.max) {
        return next(new Error('Minimum salary cannot be greater than maximum salary'));
    }
    
    next();
});

// Instance method to increment views
jobSchema.methods.incrementViews = function() {
    this.views += 1;
    return this.save();
};

// Instance method to increment applications count
jobSchema.methods.incrementApplications = function() {
    this.applicationsCount += 1;
    return this.save();
};

// Instance method to add applicant
jobSchema.methods.addApplicant = function(employeeId) {
    if (!this.applicants.includes(employeeId)) {
        this.applicants.push(employeeId);
        this.applicationsCount = this.applicants.length;
        return this.save();
    }
    return Promise.resolve(this);
};

// Instance method to remove applicant
jobSchema.methods.removeApplicant = function(employeeId) {
    this.applicants = this.applicants.filter(id => id.toString() !== employeeId.toString());
    this.applicationsCount = this.applicants.length;
    return this.save();
};

// Static method to find active jobs
jobSchema.statics.findActive = function() {
    return this.find({ 
        isActive: true, 
        applicationDeadline: { $gt: new Date() }
    });
};

// Static method to find jobs by company
jobSchema.statics.findByCompany = function(companyId) {
    return this.find({ company: companyId, isActive: true });
};

// Static method to search jobs
jobSchema.statics.search = function(filters = {}) {
    const query = { isActive: true, applicationDeadline: { $gt: new Date() } };
    
    if (filters.jobType) {
        query.jobType = { $in: Array.isArray(filters.jobType) ? filters.jobType : [filters.jobType] };
    }
    
    if (filters.experienceLevel) {
        query.experienceLevel = { $in: Array.isArray(filters.experienceLevel) ? filters.experienceLevel : [filters.experienceLevel] };
    }
    
    if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' };
    }
    
    if (filters.requiredSkills) {
        const skills = Array.isArray(filters.requiredSkills) ? filters.requiredSkills : [filters.requiredSkills];
        query.requiredSkills = { $in: skills };
    }
    
    if (filters.salaryRange) {
        const [min, max] = filters.salaryRange.split(',').map(Number);
        if (!isNaN(min) && !isNaN(max)) {
            query['salaryRange.min'] = { $gte: min };
            query['salaryRange.max'] = { $lte: max };
        }
    }
    
    if (filters.isRemote !== undefined) {
        query.isRemote = filters.isRemote;
    }
    
    return this.find(query).sort({ isUrgent: -1, createdAt: -1 });
};

module.exports = mongoose.model('Job', jobSchema);
