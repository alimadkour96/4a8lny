// const Employee = require('./employee.model');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');
// const Application = require('../application/application.model');
// const Job = require('../job/job.model');

// const registerEmployee = async (req, res) => {
//   try {
//     const { name, email, password, jobType } = req.body;

//     // Check if employee already exists
//     const existingEmployee = await Employee.findOne({ email });
//     if (existingEmployee) return res.status(400).json({ message: 'Employee already exists' });

//     // Hash the password
//     const hashedPassword = await bcrypt.hash(password, 10);

//     // Create new employee
//     const newEmployee = new Employee({ name, email, password: hashedPassword, jobType });
//     await newEmployee.save();

//     res.status(201).json({ message: 'Employee registered successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const loginEmployee = async (req, res) => {
//   try {
//     const { email, password } = req.body;

//     // Check if employee exists
//     const employee = await Employee.findOne({ email });
//     if (!employee) return res.status(404).json({ message: 'Employee not found' });

//     // Compare passwords
//     const isMatch = await bcrypt.compare(password, employee.password);
//     if (!isMatch) return res.status(400).json({ message: 'Invalid credentials' });

//     // Generate JWT token
//     const token = jwt.sign({ id: employee._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//     res.json({ token });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const getEmployeeApplications = async (req, res) => {
//   try {
//     const employeeId = req.user.id;
//     const employee = await Employee.findById(employeeId).populate('applications');
//     res.json(employee.applications);
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// const applyForJob = async (req, res) => {
//   try {
//     const employeeId = req.user.id;
//     const jobId = req.params.jobId;

//     // Check if the job exists
//     const job = await Job.findById(jobId);
//     if (!job) return res.status(404).json({ message: 'Job not found' });

//     // Create an application
//     const application = new Application({
//       job: jobId,
//       employee: employeeId,
//       status: 'Pending'
//     });

//     await application.save();
//     await Employee.findByIdAndUpdate(employeeId, { $push: { applications: application._id } });

//     res.status(201).json({ message: 'Application submitted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: 'Server error' });
//   }
// };

// module.exports = { registerEmployee, loginEmployee, getEmployeeApplications, applyForJob };

const Employee = require('./employee.model');
//const Application = require('./application.model');

const Job = require('../job/job.model'); // إذا كنت بحاجة للوصول إلى الوظائف
const bcrypt = require('bcrypt');

// تسجيل موظف جديد
async function registerEmployee(employeeData) {
    const { name, email, password, jobType, cv, portfolio, expectedSalary } = employeeData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const employee = new Employee({name,email,password: hashedPassword,jobType,cv,portfolio,expectedSalary,});
    await employee.save();
    return employee;
}

// تسجيل دخول الموظف
async function loginEmployee(email, password) {
    const employee = await Employee.findOne({ email });
    if (!employee) throw new Error('Employee not found');
    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) throw new Error('Invalid credentials');
    return employee;
}

// الحصول على الموظف بواسطة ID
async function getEmployeeById(id) {
    return await Employee.findById(id).populate('applications');
}

// عرض الوظائف المناسبة للموظف بناءً على نوع العمل
async function getJobsForEmployee(jobType) {
    return await Job.find({ jobType });
}

// التقديم على وظيفة
async function applyForJob(employeeId, jobId, cv, portfolio, expectedSalary) {
    const employee = await Employee.findById(employeeId);
    if (!employee) throw new Error('Employee not found');

    const job = await Job.findById(jobId);
    if (!job) throw new Error('Job not found');

    employee.applications.push(jobId);
    employee.cv = cv;
    employee.portfolio = portfolio;
    employee.expectedSalary = expectedSalary;

    await employee.save();
    return employee;
}

async function searchJobs(filters) {
  const query = {};

  if (filters.jobType) {
      query.jobType = filters.jobType;
  }

  if (filters.salaryRange) {
      const [min, max] = filters.salaryRange.split(',').map(Number);
      query.salaryRange = { $gte: min, $lte: max };
  }

  if (filters.requiredSkills) {
      query.requiredSkills = { $in: filters.requiredSkills.split(',') };
  }

  if (filters.experienceLevel) {
      query.experienceLevel = filters.experienceLevel;
  }

  const jobs = await Job.find(query);
  return jobs;
}


module.exports = {registerEmployee,loginEmployee,getEmployeeById,getJobsForEmployee,applyForJob,searchJobs,};