const express = require('express');
const router = express.Router();
const { createAdmin,loginAdmin,updateCompany,deleteCompany,getAllCompanies,updateEmployee,deleteEmployee,getAllEmployees,getAllJobs,getCompanyJobs,getEmployeeApplications,} = require('./admin.service');

// إنشاء مشرف جديد (Super Admin)
router.post('/register', async (req, res) => {
    try {
        const admin = await createAdmin(req.body);
        res.status(201).json({ message: 'Admin created successfully', admin });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// تسجيل دخول المشرف
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const admin = await loginAdmin(email, password);
        res.status(200).json({ message: 'Login successful', admin });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// تحديث شركة
router.put('/companies/:id', async (req, res) => {
    try {
        const company = await updateCompany(req.params.id, req.body);
        res.status(200).json({ message: 'Company updated successfully', company });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// حذف شركة
router.delete('/companies/:id', async (req, res) => {
    try {
        await deleteCompany(req.params.id);
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// عرض جميع الشركات
router.get('/companies', async (req, res) => {
    try {
        const companies = await getAllCompanies();
        res.status(200).json(companies);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// تحديث موظف
router.put('/employees/:id', async (req, res) => {
    try {
        const employee = await updateEmployee(req.params.id, req.body);
        res.status(200).json({ message: 'Employee updated successfully', employee });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// حذف موظف
router.delete('/employees/:id', async (req, res) => {
    try {
        await deleteEmployee(req.params.id);
        res.status(200).json({ message: 'Employee deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// عرض جميع الموظفين
router.get('/employees', async (req, res) => {
    try {
        const employees = await getAllEmployees();
        res.status(200).json(employees);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// عرض جميع الوظائف
router.get('/jobs', async (req, res) => {
    try {
        const jobs = await getAllJobs();
        res.status(200).json(jobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// عرض جميع الوظائف لشركة معينة
router.get('/companies/:id/jobs', async (req, res) => {
    try {
        const jobs = await getCompanyJobs(req.params.id);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// عرض جميع طلبات التوظيف لموظف معين
router.get('/employees/:id/applications', async (req, res) => {
    try {
        const applications = await getEmployeeApplications(req.params.id);
        res.status(200).json(applications);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;