const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const employeeSchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Employee name is required'],
        trim: true,
        minlength: [2, 'Employee name must be at least 2 characters long'],
        maxlength: [100, 'Employee name cannot exceed 100 characters']
    },
    email: { 
        type: String, 
        required: [true, 'Employee email is required'], 
        unique: [true, 'Employee email must be unique'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    jobType: { 
        type: String, 
        required: [true, 'Job type is required'],
        trim: true,
        minlength: [2, 'Job type must be at least 2 characters long']
    },
    skills: [{
        type: String,
        trim: true,
        minlength: [2, 'Skill must be at least 2 characters long']
    }],
    experience: {
        years: {
            type: Number,
            min: [0, 'Years of experience cannot be negative'],
            default: 0
        },
        level: {
            type: String,
            enum: ['Entry', 'Junior', 'Mid', 'Senior', 'Lead', 'Executive'],
            default: 'Entry'
        }
    },
    education: {
        degree: {
            type: String,
            enum: ['High School', 'Bachelor', 'Master', 'PhD', 'Other'],
            default: 'High School'
        },
        field: {
            type: String,
            trim: true
        },
        institution: {
            type: String,
            trim: true
        },
        graduationYear: {
            type: Number,
            min: [1950, 'Graduation year must be after 1950'],
            max: [new Date().getFullYear() + 5, 'Graduation year cannot be in the future']
        }
    },
    applications: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job' 
    }],
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
    expectedSalary: { 
        type: Number,
        min: [0, 'Expected salary cannot be negative']
    },
    location: {
        type: String,
        trim: true
    },
    isRemote: {
        type: Boolean,
        default: false
    },
    availability: {
        type: String,
        enum: ['Immediately', '2 weeks', '1 month', '3 months', 'Flexible'],
        default: 'Flexible'
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
    },
    lastActive: {
        type: Date,
        default: Date.now
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
// Note: email index is automatically created by unique: true
employeeSchema.index({ jobType: 1 });
employeeSchema.index({ skills: 1 });
employeeSchema.index({ location: 1 });
employeeSchema.index({ 'experience.level': 1 });
employeeSchema.index({ isActive: 1, isVerified: 1 });
employeeSchema.index({ name: 'text', skills: 'text' });
employeeSchema.index({ lastActive: -1 });

// Virtual for applications count
employeeSchema.virtual('applicationsCount').get(function() {
    return this.applications ? this.applications.length : 0;
});

// Virtual for experience display
employeeSchema.virtual('experienceDisplay').get(function() {
    if (this.experience.years === 0) {
        return 'Entry Level';
    }
    return `${this.experience.years} year${this.experience.years > 1 ? 's' : ''} (${this.experience.level})`;
});

// Hash password before saving
employeeSchema.pre('save', async function(next) {
    if (!this.isModified('password')) return next();
    
    try {
        const salt = await bcrypt.genSalt(12);
        this.password = await bcrypt.hash(this.password, salt);
        next();
    } catch (error) {
        next(error);
    }
});

// Update timestamp on save
employeeSchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    this.lastActive = Date.now();
    next();
});

// Compare password method
employeeSchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Instance method to add application
employeeSchema.methods.addApplication = function(jobId) {
    if (!this.applications.includes(jobId)) {
        this.applications.push(jobId);
        return this.save();
    }
    return Promise.resolve(this);
};

// Instance method to remove application
employeeSchema.methods.removeApplication = function(jobId) {
    this.applications = this.applications.filter(id => id.toString() !== jobId.toString());
    return this.save();
};

// Instance method to add skill
employeeSchema.methods.addSkill = function(skill) {
    if (!this.skills.includes(skill)) {
        this.skills.push(skill);
        return this.save();
    }
    return Promise.resolve(this);
};

// Instance method to remove skill
employeeSchema.methods.removeSkill = function(skill) {
    this.skills = this.skills.filter(s => s !== skill);
    return this.save();
};

// Instance method to update last active
employeeSchema.methods.updateLastActive = function() {
    this.lastActive = Date.now();
    return this.save();
};

// Static method to find active employees
employeeSchema.statics.findActive = function() {
    return this.find({ isActive: true, isVerified: true });
};

// Static method to search employees
employeeSchema.statics.search = function(filters = {}) {
    const query = { isActive: true, isVerified: true };
    
    if (filters.jobType) {
        query.jobType = { $regex: filters.jobType, $options: 'i' };
    }
    
    if (filters.skills) {
        const skills = Array.isArray(filters.skills) ? filters.skills : [filters.skills];
        query.skills = { $in: skills };
    }
    
    if (filters.experienceLevel) {
        query['experience.level'] = filters.experienceLevel;
    }
    
    if (filters.location) {
        query.location = { $regex: filters.location, $options: 'i' };
    }
    
    if (filters.isRemote !== undefined) {
        query.isRemote = filters.isRemote;
    }
    
    if (filters.availability) {
        query.availability = filters.availability;
    }
    
    return this.find(query).sort({ lastActive: -1 });
};

// Static method to find employees by job type
employeeSchema.statics.findByJobType = function(jobType) {
    return this.find({ 
        jobType: { $regex: jobType, $options: 'i' },
        isActive: true,
        isVerified: true
    });
};

module.exports = mongoose.model('Employee', employeeSchema);

