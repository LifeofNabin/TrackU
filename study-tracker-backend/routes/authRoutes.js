const express = require('express');
const multer = require('multer');
const User = require('../models/User');

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// 📌 Register API
router.post('/register', upload.single('image'), async (req, res) => {
    try {
        const { email, password } = req.body;
        const image = req.file.buffer.toString('base64'); // Convert image to base64

        const newUser = new User({ email, password, image });
        await newUser.save();

        res.json({ message: 'User registered successfully' });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// 📌 Login API (Face Comparison Placeholder)
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;
        const user = await User.findOne({ email });

        if (!user || user.password !== password) {
            return res.status(401).json({ error: 'Invalid credentials' });
        }

        res.json({ message: 'Login successful', user });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
