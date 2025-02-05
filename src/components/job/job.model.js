const {Schema,model,Types}= require('mongoose')

const schema=Schema ({
  title: { type: String, required: true },
  description: { type: String, required: true },
  company: { type:Types.ObjectId, ref: 'Company', required: true },
  requiredSkills:[{ type: String }], // مثل: "JavaScript", "Node.js"
  questions: [{ type:Types.ObjectId, ref: 'Question' }], // الأسئلة
  applicants: [{ type:Types.ObjectId, ref: 'Employee' }], // المتقدمين
  salaryRange: { type: [Number], default: [0, 10000] },
  jobType: { type: String, enum: ['Full-time', 'Part-time', 'Freelance'], required: true },
  experienceLevel: { type: String, enum: ['Junior', 'Mid', 'Senior'], required: true },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }

})


module.exports=model('job',schema)
