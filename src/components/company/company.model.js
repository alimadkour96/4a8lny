
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const companySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: [true, 'Company name is required'],
        trim: true,
        minlength: [2, 'Company name must be at least 2 characters long'],
        maxlength: [100, 'Company name cannot exceed 100 characters']
    },
    email: { 
        type: String, 
        required: [true, 'Company email is required'], 
        unique: [true, 'Company email must be unique'],
        lowercase: true,
        trim: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email address']
    },
    address: { 
        type: String, 
        required: [true, 'Company address is required'],
        trim: true,
        minlength: [10, 'Address must be at least 10 characters long']
    },
    phone: { 
        type: String, 
        required: [true, 'Company phone is required'],
        unique: [true, 'Company phone must be unique'],
        trim: true,
        match: [/^[\+]?[1-9][\d]{0,15}$/, 'Please enter a valid phone number']
    },
    password: { 
        type: String, 
        required: [true, 'Password is required'],
        minlength: [8, 'Password must be at least 8 characters long']
    },
    description: {
        type: String,
        trim: true,
        maxlength: [500, 'Description cannot exceed 500 characters']
    },
    industry: {
        type: String,
        required: [true, 'Industry is required'],
        trim: true
    },
    companySize: {
        type: String,
        enum: ['1-10', '11-50', '51-200', '201-500', '500+'],
        default: '1-10'
    },
    website: {
        type: String,
        trim: true,
        match: [/^https?:\/\/.+/, 'Please enter a valid website URL']
    },
    jobPosts: [{ 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Job' 
    }],
    filters: {
        salaryRange: { 
            min: { type: Number, default: 0, min: 0 },
            max: { type: Number, default: 10000, min: 0 }
        },
        jobType: { 
            type: [String], 
            enum: ['Full-time', 'Part-time', 'Freelance', 'Contract', 'Internship'],
            default: ['Full-time']
        },
        experienceLevel: { 
            type: [String], 
            enum: ['Entry', 'Junior', 'Mid', 'Senior', 'Lead', 'Executive'],
            default: ['Junior', 'Mid']
        }
    },
    isActive: {
        type: Boolean,
        default: true
    },
    isVerified: {
        type: Boolean,
        default: false
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
// Note: email and phone indexes are automatically created by unique: true
companySchema.index({ name: 'text', industry: 'text' });
companySchema.index({ isActive: 1, isVerified: 1 });
companySchema.index({ createdAt: -1 });

// Virtual for job count
companySchema.virtual('jobCount').get(function() {
    return this.jobPosts ? this.jobPosts.length : 0;
});

// Hash password before saving
companySchema.pre('save', async function(next) {
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
companySchema.pre('save', function(next) {
    this.updatedAt = Date.now();
    next();
});

// Compare password method
companySchema.methods.comparePassword = async function(candidatePassword) {
    try {
        return await bcrypt.compare(candidatePassword, this.password);
    } catch (error) {
        throw new Error('Password comparison failed');
    }
};

// Instance method to add job
companySchema.methods.addJob = function(jobId) {
    if (!this.jobPosts.includes(jobId)) {
        this.jobPosts.push(jobId);
        return this.save();
    }
    return Promise.resolve(this);
};

// Instance method to remove job
companySchema.methods.removeJob = function(jobId) {
    this.jobPosts = this.jobPosts.filter(id => id.toString() !== jobId.toString());
    return this.save();
};

// Static method to find active companies
companySchema.statics.findActive = function() {
    return this.find({ isActive: true, isVerified: true });
};

// Static method to search companies
companySchema.statics.search = function(query) {
    return this.find({
        $and: [
            { isActive: true, isVerified: true },
            {
                $or: [
                    { name: { $regex: query, $options: 'i' } },
                    { industry: { $regex: query, $options: 'i' } },
                    { description: { $regex: query, $options: 'i' } }
                ]
            }
        ]
    });
};

module.exports = mongoose.model('Company', companySchema);

