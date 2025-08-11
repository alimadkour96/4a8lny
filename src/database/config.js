const mongoose = require('mongoose');

// Database configuration
const dbConfig = {
    // Connection options
    options: {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
        bufferMaxEntries: 0,
        bufferCommands: false,
        autoIndex: false, // Disable auto-indexing in production
        maxIdleTimeMS: 30000,
        minPoolSize: 2
    },
    
    // Index configuration
    indexes: {
        // Company indexes
        company: [
            { email: 1 },
            { phone: 1 },
            { name: 'text', industry: 'text' },
            { isActive: 1, isVerified: 1 },
            { createdAt: -1 }
        ],
        
        // Job indexes
        job: [
            { company: 1, isActive: 1 },
            { jobType: 1, experienceLevel: 1 },
            { location: 1 },
            { requiredSkills: 1 },
            { 'salaryRange.min': 1, 'salaryRange.max': 1 },
            { isActive: 1, isUrgent: 1 },
            { title: 'text', description: 'text', requiredSkills: 'text' },
            { applicationDeadline: 1 },
            { createdAt: -1 }
        ],
        
        // Employee indexes
        employee: [
            { email: 1 },
            { jobType: 1 },
            { skills: 1 },
            { location: 1 },
            { 'experience.level': 1 },
            { isActive: 1, isVerified: 1 },
            { name: 'text', skills: 'text' },
            { lastActive: -1 }
        ],
        
        // Application indexes
        application: [
            { job: 1, employee: 1 },
            { status: 1, createdAt: -1 },
            { employee: 1, status: 1 },
            { job: 1, status: 1 },
            { 'interviewDetails.scheduledDate': 1 },
            { applicationScore: -1 },
            { createdAt: -1 }
        ],
        
        // Question indexes
        question: [
            { job: 1, isActive: 1 },
            { company: 1, isActive: 1 },
            { category: 1 },
            { difficulty: 1 },
            { questionText: 'text', category: 'text' },
            { order: 1 }
        ],
        
        // Answer indexes
        answer: [
            { question: 1, applicant: 1 },
            { application: 1 },
            { isCorrect: 1 },
            { isSubmitted: 1 },
            { createdAt: -1 }
        ]
    },
    
    // Validation rules
    validation: {
        password: {
            minLength: 8,
            requireUppercase: true,
            requireLowercase: true,
            requireNumbers: true,
            requireSpecialChars: false
        },
        email: {
            pattern: /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/
        },
        phone: {
            pattern: /^[\+]?[1-9][\d]{0,15}$/
        },
        url: {
            pattern: /^https?:\/\/.+/
        }
    },
    
    // Error messages
    errors: {
        connection: 'Failed to connect to database',
        validation: 'Validation failed',
        duplicate: 'Duplicate entry found',
        notFound: 'Record not found',
        unauthorized: 'Unauthorized access',
        server: 'Internal server error'
    }
};

// Create indexes for all models
const createIndexes = async () => {
    try {
        console.log('🔍 Creating database indexes...');
        
        // Import models
        const Company = require('../components/company/company.model');
        const Job = require('../components/job/job.model');
        const Employee = require('../components/employee/employee.model');
        const Application = require('../components/application/application.model');
        const { Question, Answer } = require('../components/Q&A/Q&A.model');
        
        // Create indexes for each model
        await Promise.all([
            Company.createIndexes(),
            Job.createIndexes(),
            Employee.createIndexes(),
            Application.createIndexes(),
            Question.createIndexes(),
            Answer.createIndexes()
        ]);
        
        console.log('✅ Database indexes created successfully');
    } catch (error) {
        console.error('❌ Error creating indexes:', error.message);
    }
};

// Database health check
const healthCheck = async () => {
    try {
        const status = mongoose.connection.readyState;
        const states = {
            0: 'disconnected',
            1: 'connected',
            2: 'connecting',
            3: 'disconnecting'
        };
        
        return {
            status: states[status] || 'unknown',
            readyState: status,
            isConnected: status === 1,
            database: mongoose.connection.name,
            host: mongoose.connection.host,
            port: mongoose.connection.port
        };
    } catch (error) {
        return {
            status: 'error',
            error: error.message,
            isConnected: false
        };
    }
};

// Database statistics
const getStats = async () => {
    try {
        const Company = require('../components/company/company.model');
        const Job = require('../components/job/job.model');
        const Employee = require('../components/employee/employee.model');
        const Application = require('../components/application/application.model');
        const { Question, Answer } = require('../components/Q&A/Q&A.model');
        
        const stats = await Promise.all([
            Company.countDocuments(),
            Job.countDocuments(),
            Employee.countDocuments(),
            Application.countDocuments(),
            Question.countDocuments(),
            Answer.countDocuments()
        ]);
        
        return {
            companies: stats[0],
            jobs: stats[1],
            employees: stats[2],
            applications: stats[3],
            questions: stats[4],
            answers: stats[5],
            total: stats.reduce((sum, count) => sum + count, 0)
        };
    } catch (error) {
        console.error('❌ Error getting database stats:', error.message);
        return null;
    }
};

module.exports = {
    dbConfig,
    createIndexes,
    healthCheck,
    getStats
};
