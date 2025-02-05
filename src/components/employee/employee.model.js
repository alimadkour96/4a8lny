const {Schema,model,Types}= require('mongoose')
const schema=Schema ({
    name: { type: String, required:[true,'employee name required']},
    email: { type: String, required:[true,'employee email required'],unique:[true,'employee email must be unique']},
    password: { type: String, required: true }, // مشفرة باستخدام bcrypt
    jobType: { type: String, required: true }, // مثل: "مبرمج"
    applications: [{ type:Types.ObjectId, ref: 'Job' }], // الوظائف اللي قدم عليها
    cv: { type: String }, // رابط السيرة الذاتية
    portfolio: { type: String }, // رابط سابقة الأعمال
    expectedSalary: { type: Number },
    createdAt: { type: Date, default: Date.now }
})


module.exports=model('employee',schema)

