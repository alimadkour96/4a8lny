const Company = require('./company.model');
const Job = require('../job/job.model');
const bcrypt = require('bcrypt');

// تسجيل شركة جديدة
async function registerCompany(companyData) {
    const { name, email, address, phone, password } = companyData;
    const company = new Company({ name, email, address, phone, password });
    await company.save();
    return company;
}

// تسجيل دخول الشركة
async function loginCompany(email, password) {
    const company = await Company.findOne({ email });
    if (!company) throw new Error('Company not found');
    const isMatch = await company.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');
    return company;
}

// الحصول على معلومات الشركة
async function getCompanyById(id) {
    return await Company.findById(id).populate('jobPosts');
}

// تحديث معلومات الشركة
async function updateCompany(id, updateData) {
    return await Company.findByIdAndUpdate(id, updateData, { new: true });
}

// حذف الشركة
async function deleteCompany(id) {
    return await Company.findByIdAndDelete(id);
}

// إضافة وظيفة
async function addJob(companyId, jobData) {
    const job = new Job({ ...jobData, company: companyId });
    await job.save();

    const company = await Company.findById(companyId);
    company.jobPosts.push(job._id);
    await company.save();

    return job;
}

// حذف وظيفة
async function deleteJob(companyId, jobId) {
    const job = await Job.findByIdAndDelete(jobId);
    if (!job) throw new Error('Job not found');

    const company = await Company.findById(companyId);
    company.jobPosts = company.jobPosts.filter(id => id.toString() !== jobId);
    await company.save();

    return job;
}

// تحديث وظيفة
async function updateJob(jobId, updates) {
    const job = await Job.findByIdAndUpdate(jobId, updates, { new: true });
    if (!job) throw new Error('Job not found');
    return job;
}

// عرض الوظائف لشركة معينة
async function showJobs(companyId) {
    const jobs = await Job.find({ company: companyId });
    return jobs;
}

// فلترة الوظائف
async function filterJobs(companyId, filters) {
    const query = { company: companyId };

    if (filters.salaryRange) {
        const [min, max] = filters.salaryRange.split(',').map(Number);
        query.salaryRange = { $gte: min, $lte: max };
    }



    // if (filters.salaryRange) {
    //     query.salaryRange = { $gte: filters.salaryRange[0], $lte: filters.salaryRange[1] };
    // }


    if (filters.skills) {
        query.requiredSkills = { $in: filters.skills.split(',') };
    }

    // if (filters.jobType) {
    //     query.jobType = filters.jobType;
    // }
    

    if (filters.experienceLevel) {
        query.experienceLevel = filters.experienceLevel;
    }

    const jobs = await Job.find(query);
    return jobs;
}

// تصدير الوظائف
module.exports = {registerCompany,loginCompany,getCompanyById,updateCompany,deleteCompany,addJob,deleteJob,updateJob,showJobs,filterJobs,
};