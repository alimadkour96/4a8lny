# 4a8lny - Job Management System

This project is a **Job Management System** that allows:
- **Companies** to post jobs, filter applicants, and evaluate their responses.
- **Employees** to search for jobs, apply, and track their applications.
- **Admin** to manage all entities (companies, employees, and jobs) with full control.

---

## **Technologies Used**
- **Backend**: Node.js, Express.js
- **Database**: MongoDB (with Mongoose for schema modeling)
- **Security**: bcrypt for password hashing
- **Testing**: Postman for API testing

---

## Why These Skills Were Used

**Node.js + Express.js**:
Why: These technologies are lightweight, fast, and perfect for building RESTful APIs.
Benefit: They allow for quick development and scalability.

**MongoDB**:
Why: MongoDB is a NoSQL database that is flexible and scalable, making it ideal for handling unstructured data like job postings and user profiles.
Benefit: It supports dynamic schemas, which is useful for evolving requirements.

**Mongoose**:
Why: Mongoose simplifies interactions with MongoDB by providing a schema-based solution.
Benefit: It ensures data consistency and validation.

**bcrypt**:
Why: Hashing passwords is essential for security.
Benefit: It protects user data by ensuring passwords are not stored in plain text.

**Postman**:
Why: Postman is a powerful tool for testing APIs during development.
Benefit: It helps ensure that all endpoints work as expected before integrating with the frontend.

---

## **Features**
### **For Companies**:
- Register/Login.
- Post jobs with details like title, description, salary range, and required skills.
- Filter applicants based on salary expectations, skills, or experience level.
- Evaluate answers to job-specific questions.

### **For Employees**:
- Register/Login.
- Search for jobs based on job type, salary range, or required skills.
- Apply for jobs by submitting their CV, portfolio, and expected salary.
- Track their job applications.

### **For Admin**:
- Full control over companies, employees, and jobs.
- Update or delete any entity (company, employee, or job).
- View all data for oversight.

---

## 📁 Project Structure

```
4a8lny/
├── app.js                 # Main server file
├── package.json          # Dependencies and scripts
├── FrontEnd/             # Frontend application
│   ├── css/
│   │   └── styles.css
│   ├── js/
│   │   ├── login.js
│   │   ├── main.js
│   │   └── register.js
│   ├── index.html
│   ├── login.html
│   └── register.html
├── src/                  # Backend source code
│   ├── components/       # Feature modules
│   │   ├── admin/        # Admin functionality
│   │   │   ├── admin.model.js
│   │   │   ├── admin.service.js
│   │   │   └── admin.api.js
│   │   ├── answer/       # Answer management
│   │   ├── application/  # Job application handling
│   │   ├── auth/         # Authentication system
│   │   ├── company/      # Company management
│   │   │   ├── company.model.js
│   │   │   ├── company.service.js
│   │   │   └── company.api.js
│   │   ├── employee/     # Employee operations
│   │   │   ├── employee.model.js
│   │   │   ├── employee.service.js
│   │   │   └── employee.api.js
│   │   ├── job/          # Job posting management
│   │   │   ├── job.model.js
│   │   │   ├── job.service.js
│   │   │   └── job.api.js
│   │   └── Q&A/          # Question & Answer system
│   └── database/         # Database configuration
│       └── database.js
└── README.md            # Project documentation
```

---

## **Setup Instructions**
Follow these steps to set up and run the project locally:

1. **Clone the Repository**:
```bash
git clone https://github.com/alimadkour96/4a8lny
```

2. **Navigate to the Project Folder**:
```bash
cd 4a8lny
```

3. **Install Dependencies**:
```bash
npm install
```

4. **Set Up Environment Variables**:
Create a .env file in the root folder.
```bash
DB_URI=mongodb://localhost:27018/4a8lny
PORT=5000
```

5. **Run the Server**:
```bash
npm start
```

6. **Access the API**:
The server will run on http://localhost:5000.
Use Postman or any API client to test the endpoints.

---

## API Documentation
Base URL: ```http://localhost:5000```

### 1. **Companies**
**Register a Company**: POST /api/company/register
```json
{
  "name": "Tech Corp",
  "email": "tech@example.com",
  "password": "password123",
  "address": "123 Main St",
  "phone": "1234567890"
}
```

**Login**: POST /api/company/login
```json
{
  "email": "tech@example.com",
  "password": "password123"
}
```

**Post a Job**: POST /api/company/jobs
```json
{
  "title": "Software Engineer",
  "description": "Develop software applications.",
  "salaryRange": [4000, 6000],
  "requiredSkills": ["JavaScript", "Node.js"],
  "experienceLevel": "Mid"
}
```

### 2. **Employees**
**Register an Employee**: POST /api/employee/register
```json
{
  "name": "John Doe",
  "email": "john@example.com",
  "password": "password123",
  "jobType": "مبرمج",
  "cv": "http://example.com/cv.pdf",
  "portfolio": "http://example.com/portfolio",
  "expectedSalary": 5000
}
```

**Search for Jobs**: GET /api/employee/jobs/search?jobType=مبرمج&salaryRange=5000,6000

**Apply for a Job**: POST /api/employee/apply
```json
{
  "jobId": "65f4c8e8f1a2b3c4d5e6f7g8",
  "cv": "http://example.com/cv.pdf",
  "portfolio": "http://example.com/portfolio",
  "expectedSalary": 5000
}
```

### 3. **Admin**
**View All Companies**: GET /api/admin/companies

**View All Employees**: GET /api/admin/employees

**View All Jobs**: GET /api/admin/jobs

---

## Future Enhancements
**Authentication**:
- Implement JWT (JSON Web Tokens) for secure authentication.

**Advanced Filtering**:
- Add more filters (e.g., location, remote work, job type).

**Notifications**:
- Send email notifications to applicants and companies.

**Reports**:
- Generate reports for admin (e.g., number of jobs posted, applications received).

---

## 🛠️ Additional Tech Stack Details

### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **MongoDB** - NoSQL database
- **Mongoose** - MongoDB object modeling
- **JWT** - JSON Web Token authentication
- **bcrypt** - Password hashing
- **CORS** - Cross-origin resource sharing

### Development Tools
- **Nodemon** - Development server with auto-reload
- **ESLint** - Code linting and formatting

---

## 🔧 Configuration

### Database Connection
The application connects to MongoDB. You can modify the connection string in `app.js` or use environment variables.

### Port Configuration
Default port is 5000. You can change this by setting the `PORT` environment variable.

---

## 🧪 Development

### Running Tests
```bash
npm test
```

### Code Linting
```bash
npm run lint
```

### Building for Production
```bash
npm run build
```

---

## 📝 License

This project is licensed under the ISC License - see the [LICENSE](LICENSE) file for details.

---

## Contact
For questions or feedback, feel free to reach out:

**Email**: alimadkour2001@gmail.com

**GitHub**: [alimadkour96](https://github.com/alimadkour96)
