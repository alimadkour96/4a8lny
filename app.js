const express = require('express');
const mongoose = require('mongoose');
//const dotenv = 
const cors = require('cors');
const bodyParser = require('body-parser');

// Import the routes for each component
const authRoutes = require('./src/components/auth/auth.api');
const adminRoutes = require('./src/components/admin/admin.api');
const companyRoutes = require('./src/components/company/company.api');
const jobRoutes = require('./src/components/job/job.api');
const employeeRoutes = require('./src/components/employee/employee.api');
const applicationRoutes = require('./src/components/application/appliaction.api');
const answerRoutes = require('./src/components/Q&A/Q&A.api');
const questionRoutes = require('./src/components/Q&A/Q&A.api');

const app = express();

require('dotenv').config()
// Load environment variables
 //dotenv.config();

// Initialize app

// Middleware setup
app.use(express.json());
app.use(express.static('public'));
//app.use(cors());
app.use(bodyParser.json()); // For parsing JSON bodies

// Database connect
mongoose.connect('mongodb://localhost:27018/4a8lny',)
.then(() => console.log('MongoDB connected'))
.catch(err => console.log('MongoDB connection error:', err));

//routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/company', companyRoutes);
app.use('/api/job', jobRoutes);
app.use('/api/employee', employeeRoutes);
app.use('/api/application', applicationRoutes);
app.use('/api/Q&A',questionRoutes,answerRoutes);


const port = 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
