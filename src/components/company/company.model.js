
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const companySchema = new mongoose.Schema({
    name: { type: String, required: [true, 'Company name is required'] },
    email: { type: String, required: [true, 'Company email is required'], unique: [true, 'Company email must be unique'] },
    address: { type: String, required: [true, 'Company address is required'] },
    phone: { type: String, required: [true, 'Company phone is required'],unique: [true, 'Company phone must be unique'] },
    
    password: { type: String, required: true }, // سيتم تشفيرها باستخدام bcrypt
    jobPosts: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Job' }], // الوظائف التي نشرتها الشركة
    filters: {
        salaryRange: { type: [Number], default: [0, 10000] }, // نطاق الراتب
        jobType: { type: String, enum: ['Full-time', 'Part-time', 'Freelance'] }, // نوع الوظيفة
        experienceLevel: { type: String, enum: ['Junior', 'Mid', 'Senior'] } // مستوى الخبرة
    },
    createdAt: { type: Date, default: Date.now }
});

// تشفير كلمة المرور قبل حفظ الشركة في قاعدة البيانات
companySchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// مقارنة كلمة المرور المدخلة مع المشفرة
companySchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Company', companySchema);

