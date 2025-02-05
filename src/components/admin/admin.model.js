// const {Schema,model,Types}= require('mongoose')
// const schema=Schema ({
//     username:{ type: String, required: true },
//     password:{ type: String, required: true }, // مشفرة باستخدام bcrypt
//     role:{ type: String, enum: ['SuperAdmin', 'Admin'], default: 'Admin' },
//     createdAt:{ type: Date, default: Date.now }
// })
// module.exports=model('admin',schema)


const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const adminSchema = new mongoose.Schema({
    email: { 
        type: String, 
        required: [true, 'Admin email is required'], 
        unique: [true, 'Admin email must be unique'] 
    },
    password: { 
        type: String, 
        required: [true, 'Admin password is required'] 
    },
    isSuperAdmin: { 
        type: Boolean, 
        default: true 
    }, // للإشارة إلى أن هذا المشرف هو Super Admin
    createdAt: { 
        type: Date, 
        default: Date.now 
    }
});

// تشفير كلمة المرور قبل حفظها في قاعدة البيانات
adminSchema.pre('save', async function (next) {
    if (!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 10);
    next();
});

// مقارنة كلمة المرور المدخلة مع المشفرة
adminSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);