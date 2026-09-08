const express = require('express');
const router = express.Router();
const User = require('../models/User');

router.post('/signup', async (req, res) => {
    try {
        const user = new User(req.body);
        await user.save();
        res.status(201).json({ message: 'User created', userId: user._id });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;