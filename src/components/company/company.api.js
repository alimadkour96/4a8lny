const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();
const {registerCompany,loginCompany,getCompanyById,updateCompany,deleteCompany,addJob,deleteJob,updateJob,showJobs,filterJobs,}=require('./company.service');

// تسجيل شركة جديدة
router.post('/register', async (req, res) => {
    try {
        const company = await registerCompany(req.body);
        res.status(201).json({ message: 'Company registered successfully', company });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// تسجيل دخول الشركة
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const company = await loginCompany(email, password);
        res.status(200).json({ message: 'Login successful', company });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// الحصول على معلومات الشركة
router.get('/:id', async (req, res) => {
    try {
        // تنظيف المعرف (إزالة المسافات البيضاء والأحرف غير المرئية)
        const companyId = req.params.id.trim();

        // التحقق من صحة ObjectId
        if (!mongoose.Types.ObjectId.isValid(companyId)) {
            return res.status(400).json({ message: 'Invalid company ID' });
        }

        // الحصول على معلومات الشركة
        const company = await getCompanyById(companyId,req.body);
        res.status(200).json(company);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// تحديث معلومات الشركة
router.put('/:id', async (req, res) => {
    try {
        const company = await updateCompany(req.params.id, req.body);
        res.status(200).json({ message: 'Company updated successfully', company });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// حذف الشركة
router.delete('/:id', async (req, res) => {
    try {
        await deleteCompany(req.params.id);
        res.status(200).json({ message: 'Company deleted successfully' });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// إضافة وظيفة
router.post('/:id/jobs', async (req, res) => {
    try {
        const job = await addJob(req.params.id, req.body);
        res.status(201).json({ message: 'Job added successfully', job });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// حذف وظيفة
router.delete('/:companyId/jobs/:jobId', async (req, res) => {
    try {
        const job = await deleteJob(req.params.companyId, req.params.jobId);
        res.status(200).json({ message: 'Job deleted successfully', job });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// تحديث وظيفة
router.put('/jobs/:jobId', async (req, res) => {
    try {
        const job = await updateJob(req.params.jobId, req.body);
        res.status(200).json({ message: 'Job updated successfully', job });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// عرض الوظائف لشركة معينة
router.get('/:id/jobs', async (req, res) => {
    try {
        const jobs = await showJobs(req.params.id);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// فلترة الوظائف
router.get('/:id/jobs/filter', async (req, res) => {
    try {
        const jobs = await filterJobs(req.params.id, req.query);
        res.status(200).json(jobs);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;