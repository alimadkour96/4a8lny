// const Admin = require('./admin.model');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const login = async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Check if admin exists
//     const admin = await Admin.findOne({ username });
//     if (!admin) return res.status(404).json({ message: 'Admin not found' });

//     // Check if password matches
//     const isMatch = await bcrypt.compare(password, admin.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     // Generate JWT token
//     const token = jwt.sign({ id: admin._id, role: admin.role }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const getDashboardStats = async (req, res) => {
//   try {
//     // Sample response, can be extended to show real stats
//     res.json({
//       companies: await Company.countDocuments(),
//       employees: await Employee.countDocuments(),
//       jobs: await Job.countDocuments()
//     });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = { login, getDashboardStats };

const Admin = require('./admin.model');
const Company = require('../company/company.model');
const Employee = require('../employee/employee.model');
const Job = require('../job/job.model');
const bcrypt = require('bcrypt');

// إنشاء مشرف جديد (Super Admin)
async function createAdmin(adminData) {
    const { email, password } = adminData;
    const admin = new Admin({ email, password });
    await admin.save();
    return admin;
}

// تسجيل دخول المشرف
async function loginAdmin(email, password) {
    const admin = await Admin.findOne({ email });
    if (!admin) throw new Error('Admin not found');
    const isMatch = await admin.comparePassword(password);
    if (!isMatch) throw new Error('Invalid credentials');
    return admin;
}

// تحديث شركة
async function updateCompany(companyId, updateData) {
    const company = await Company.findByIdAndUpdate(companyId, updateData, { new: true });
    if (!company) throw new Error('Company not found');
    return company;
}

// حذف شركة
async function deleteCompany(companyId) {
    const company = await Company.findByIdAndDelete(companyId);
    if (!company) throw new Error('Company not found');
    return company;
}

// عرض جميع الشركات
async function getAllCompanies() {
    return await Company.find({});
}

// تحديث موظف
async function updateEmployee(employeeId, updateData) {
    const employee = await Employee.findByIdAndUpdate(employeeId, updateData, { new: true });
    if (!employee) throw new Error('Employee not found');
    return employee;
}

// حذف موظف
async function deleteEmployee(employeeId) {
    const employee = await Employee.findByIdAndDelete(employeeId);
    if (!employee) throw new Error('Employee not found');
    return employee;
}

// عرض جميع الموظفين
async function getAllEmployees() {
    return await Employee.find({});
}

// عرض جميع الوظائف
async function getAllJobs() {
    return await Job.find({});
}

// عرض جميع الوظائف لشركة معينة
async function getCompanyJobs(companyId) {
    return await Job.find({ company: companyId });
}

// عرض جميع طلبات التوظيف لموظف معين
async function getEmployeeApplications(employeeId) {
    const employee = await Employee.findById(employeeId).populate('applications');
    if (!employee) throw new Error('Employee not found');
    return employee.applications;
}

module.exports = {createAdmin,loginAdmin,updateCompany,deleteCompany,getAllCompanies,updateEmployee,deleteEmployee,getAllEmployees,getAllJobs,getCompanyJobs,getEmployeeApplications,};