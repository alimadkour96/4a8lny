const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('./auth.service');

router.post('/register', async (req, res) => {
    try {
        const user = await registerUser(req.body);
        res.status(201).json({ message: 'User registered successfully', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

router.post('/login', async (req, res) => {
    try {
        const user = await loginUser(req.body.email, req.body.password);
        res.status(200).json({ message: 'Login successful', user });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = router;