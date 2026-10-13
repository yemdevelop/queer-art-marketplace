const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Artwork = require('../models/Artwork');
const requireAuth = require('../middleware/auth');
const loadOwnedArtwork = require('../middleware/loadOwnedArtwork');

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

        const body = req.body ?? {};
        const fields = {};
        for (const key of EDITABLE_FIELDS) {
            if (body[key] !== undefined) fields[key] = body[key];
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
        res.status(500).json({ error: 'Failed to fetch artwork' });
    }
});

router.delete('/:id', requireAuth, loadOwnedArtwork, async (req, res) => {
    const artwork = req.artwork;

    try {
        if (artwork.hasSales()) {
            return res.status(409).json({
                error: 'Cannot delete a listing that has sales'
            });
        }

        await artwork.deleteOne();
        res.status(200).json({
            message: 'Artwork successfully deleted'
        });
    } catch (err) {
        res.status(500).json({ error: 'Failed to delete artwork' });
    }
});

router.patch('/:id', requireAuth, loadOwnedArtwork, async (req, res) => {
    const artwork = req.artwork;

    try {
        if (artwork.hasSales()) {
            return res.status(409).json({
                error: 'Cannot edit a listing that has sales'
            });
        }

        const body = req.body ?? {};
        for (const key of EDITABLE_FIELDS) {
            if (body[key] !== undefined) artwork[key] = body[key];
        }

        await artwork.save();
        res.status(200).json(artwork);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

module.exports = router;
