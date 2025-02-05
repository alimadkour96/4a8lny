const User = require('./auth.model');
const bcrypt = require('bcrypt');

const registerUser = async (userData) => {
    const { fullName, email, phone, position, password } = userData;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ fullName, email, phone, position, password: hashedPassword });
    await user.save();
    return user;
};

const loginUser = async (email, password) => {
    const user = await User.findOne({ email });
    if (!user) throw new Error('User not found');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) throw new Error('Invalid credentials');
    return user;
};

module.exports = { registerUser, loginUser };