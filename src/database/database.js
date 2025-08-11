const mongoose = require('mongoose');
const { dbConfig, createIndexes, healthCheck, getStats } = require('./config');
require('dotenv').config();

const connectDB = async () => {
    try {
        const connectionString = process.env.CONNECTION_STRING || 'mongodb://localhost:27017/4a8lny';
        
        console.log('🔌 Connecting to MongoDB...');
        console.log(`📊 Database: ${connectionString.split('/').pop()}`);
        
        await mongoose.connect(connectionString, dbConfig.options);
        
        console.log('✅ MongoDB connected successfully');
        console.log(`📊 Database: ${mongoose.connection.name}`);
        console.log(`🔗 Host: ${mongoose.connection.host}`);
        console.log(`🚪 Port: ${mongoose.connection.port}`);
        console.log(`🔧 Mongoose version: ${mongoose.version}`);
        
        // Create indexes after connection
        await createIndexes();
        
        // Log initial stats
        const stats = await getStats();
        if (stats) {
            console.log('📈 Database Statistics:');
            console.log(`   Companies: ${stats.companies}`);
            console.log(`   Jobs: ${stats.jobs}`);
            console.log(`   Employees: ${stats.employees}`);
            console.log(`   Applications: ${stats.applications}`);
            console.log(`   Questions: ${stats.questions}`);
            console.log(`   Answers: ${stats.answers}`);
            console.log(`   Total Documents: ${stats.total}`);
        }
        
    } catch (error) {
        console.error('❌ Error connecting to MongoDB:', error.message);
        console.error('🔍 Error details:', error);
        process.exit(1);
    }
};

// Handle connection events
mongoose.connection.on('error', (err) => {
    console.error('❌ MongoDB connection error:', err.message);
    console.error('🔍 Error details:', err);
});

mongoose.connection.on('disconnected', () => {
    console.log('⚠️ MongoDB disconnected');
});

mongoose.connection.on('reconnected', () => {
    console.log('🔄 MongoDB reconnected');
});

mongoose.connection.on('close', () => {
    console.log('🔒 MongoDB connection closed');
});

// Graceful shutdown
process.on('SIGINT', async () => {
    try {
        console.log('\n🔄 Shutting down gracefully...');
        await mongoose.connection.close();
        console.log('🔄 MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during shutdown:', err.message);
        process.exit(1);
    }
});

process.on('SIGTERM', async () => {
    try {
        console.log('\n🔄 Shutting down gracefully...');
        await mongoose.connection.close();
        console.log('🔄 MongoDB connection closed through app termination');
        process.exit(0);
    } catch (err) {
        console.error('❌ Error during shutdown:', err.message);
        process.exit(1);
    }
});

// Export connection function and utilities
module.exports = {
    connectDB,
    healthCheck,
    getStats,
    connection: mongoose.connection
};