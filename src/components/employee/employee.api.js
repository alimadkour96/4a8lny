
// const express = require('express');
// const router = express.Router();
// const employeeService = require('./employee.service');

// // Register an employee
// router.post('/register', employeeService.registerEmployee);

// // Login for employee
// router.post('/login', employeeService.loginEmployee);

// // Get all job applications of an employee
// router.get('/applications', employeeService.getEmployeeApplications);

// // Apply for a job
// router.post('/apply/:jobId', employeeService.applyForJob);

// module.exports = router;

const express = require('express');
const router = express.Router();
const {registerEmployee,loginEmployee,getEmployeeById,getJobsForEmployee,applyForJob,searchJobs,}=require('./employee.service');

// تسجيل موظف جديد
router.post('/register', async (req, res) => {
    try {
        const employee = await registerEmployee(req.body);
        res.status(201).json({ message: 'Employee registered successfully', employee });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// تسجيل دخول الموظف
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const employee = await loginEmployee(email, password);
        res.status(200).json({ message: 'Login successful', employee });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// الحصول على معلومات الموظف
router.get('/:id', async (req, res) => {
    try {
        const employee = await getEmployeeById(req.params.id);
        res.status(200).json(employee);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// عرض الوظائف المناسبة للموظف
router.get('/:id/jobs', async (req, res) => {
    try {
        const employee = await getEmployeeById(req.params.id);
        const jobs = await getJobsForEmployee(employee.jobType);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// التقديم على وظيفة
router.post('/:id/apply', async (req, res) => {
    try {
        const { jobId, cv, portfolio, expectedSalary } = req.body;
        const employee = await applyForJob(req.params.id, jobId, cv, portfolio, expectedSalary);
        res.status(201).json({ message: 'Application submitted successfully', employee });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// بحث عن الوظائف
router.get('/jobs/search', async (req, res) => {
    try {
        const jobs = await searchJobs(req.query); // استخدام query strings للبحث
        res.status(200).json(jobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;