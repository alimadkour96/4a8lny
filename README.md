# 4a8lny
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
## Folder Structure:

src/
 ├── components/
 │   ├── admin/
 │   │   ├── admin.model.js
 │   │   ├── admin.service.js
 │   │   └── admin.api.js
 │   ├── company/
 │   │   ├── company.model.js
 │   │   ├── company.service.js
 │   │   └── company.api.js
 │   ├── employee/
 │   │   ├── employee.model.js
 │   │   ├── employee.service.js
 │   │   └── employee.api.js
 │   ├── job/
 │   │   ├── job.model.js
 │   │   ├── job.service.js
 │   │   └── job.api.js
 ├── database/
 │   └── database.js
 ├── utils/
 │   ├── helpers.js
 │   └── validations.js
 ├── .env
 ├── .gitignore
 ├── package.json
 ├── package-lock.json
 └── app.js
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

## **Setup Instructions**
Follow these steps to set up and run the project locally:

1. **Clone the Repository**:
```bash
   git clone https://github.com/your-username/your-repo-name.git
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
   DB_URI=your-mongodb-connection-string
   PORT=3000
   ```
5. **Run the Server**:
```bash
   npm start
   ```
6. **Access the API**:
The server will run on http://localhost:3000.
Use Postman or any API client to test the endpoints.




## API Documentation
Base URL: ```http://localhost:3000```

1. **Companies**
Register a Company:=> POST /api/company/register

```json
{
  "name": "Tech Corp",
  "email": "tech@example.com",
  "password": "password123",
  "address": "123 Main St",
  "phone": "1234567890"
}
```
Login:=> POST /api/company/login

```json
{
  "email": "tech@example.com",
  "password": "password123"
}
```
Post a Job:=> POST /api/company/jobs

```json
{
  "title": "Software Engineer",
  "description": "Develop software applications.",
  "salaryRange": [4000, 6000],
  "requiredSkills": ["JavaScript", "Node.js"],
  "experienceLevel": "Mid"
}
```

2. **Employees**
Register an Employee:=> POST /api/employee/register

Body:

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
Search for Jobs:=> GET /api/employee/jobs/search?jobType=مبرمج&salaryRange=3000,6000

Apply for a Job:=> POST /api/employee/apply

```json
{
  "jobId": "65f4c8e8f1a2b3c4d5e6f7g8",
  "cv": "http://example.com/cv.pdf",
  "portfolio": "http://example.com/portfolio",
  "expectedSalary": 5000
}
```
3. **Admin**
View All Companies:=> GET /api/admin/companies

View All Employees:=> GET /api/admin/employees

View All Jobs:=> GET /api/admin/jobs

---
## Future Enhancements
**Frontend Development**:
-Build a user-friendly interface using React.js or Vue.js.

**Authentication**:
Implement JWT (JSON Web Tokens) for secure authentication.

**Advanced Filtering**:
Add more filters (e.g., location, remote work, job type).

**Notifications**:
Send email notifications to applicants and companies.

**Reports**:
Generate reports for admin (e.g., number of jobs posted, applications received).


## Contact
For questions or feedback, feel free to reach out:

Email: alimadkour2001@gmail.com

GitHub: alimadkour96
