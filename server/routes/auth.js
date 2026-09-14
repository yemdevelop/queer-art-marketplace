const express = require('express');
const router = express.Router();
const User = require('../models/User');

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'User created', userId: user._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

const DUMMY_HASH = '$2b$10$CwTycUXWue0Thq9StjUM0uJ8ZFgqmnZK7q0v/O5DfHQq3Bxbp8lTe';

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        const isMatch = await bcrypt.compare(password, user ? user.password : DUMMY_HASH);
        
        if (!user || !isMatch) {
            return res.status(401).json({ error: 'Invalid credentials' })
        }

        const token = jwt.sign(
            { userId: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: '7d' }
        );

        res.json({ token, userId: user._id, role: user.role });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
})

module.exports = router;