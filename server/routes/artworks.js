const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Artwork = require('../models/Artwork');
const requireAuth = require('../middleware/auth');

// Fields an artist may set; status and editionsSold are managed by the server
const EDITABLE_FIELDS = [
    'title', 'description', 'images', 'price', 'type',
    'weight', 'dimensions', 'file', 'editionSize', 'downloadLimit',
];

router.post('/', requireAuth, async (req, res) => {
    try {
        if (req.user.role !== 'artist') {
            return res.status(403).json({ error: 'Only artists can create listings' });
        }

        const fields = {};
        for (const key of EDITABLE_FIELDS) {
            if (req.body[key] !== undefined) fields[key] = req.body[key];
        }

        const artwork = new Artwork({ ...fields, artist: req.user.userId });
        await artwork.save();
        res.status(201).json(artwork);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

router.get('/', async (req, res) => {
    try {
        const artworks = await Artwork.find();
        res.json(artworks);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch artworks' });
    }
});

router.get('/:id', async (req, res) => {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({ error: 'Artwork not found' });
        }

        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ error: 'Artwork not found' });
        }
        res.json(artwork);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;