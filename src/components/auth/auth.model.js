const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
    fullName: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    phone: { type: String, required: true },
    position: { type: String, enum: ['admin', 'company', 'employee'], required: true },
    password: { type: String, required: true },
});

module.exports = mongoose.model('User', userSchema);