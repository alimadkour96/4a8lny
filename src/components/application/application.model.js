const {Schema,model,Types}= require('mongoose')
const schema=Schema ({
  job:{ type:Types.ObjectId, ref: 'Job', required: true },
  employee:{ type:Types.ObjectId, ref: 'Employee', required: true },
  cv:{ type: String }, // رابط السيرة الذاتية
  portfolio:{ type: String }, // رابط سابقة الأعمال
  answers:[{ type:Types.ObjectId, ref: 'Answer' }], // إجابات المتقدمين للأسئلة
  expectedSalary:{ type: Number },
  status:{ type: String, enum: ['Pending', 'Shortlisted', 'Rejected'], default: 'Pending' },
  createdAt:{ type: Date, default: Date.now }

})

module.exports=model('application',schema)


// // src/components/application/application.model.js

// const mongoose = require('mongoose');

// const applicationSchema = new mongoose.Schema({
//   job: { type: mongoose.Schema.Types.ObjectId, ref: 'Job', required: true },
//   employee: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
//   status: { type: String, enum: ['Pending', 'Accepted', 'Rejected'], default: 'Pending' },
//   createdAt: { type: Date, default: Date.now }
// });

// const Application = mongoose.model('Application', applicationSchema);

// module.exports = Application;
