const mongoose = require('mongoose');
const Artwork = require('../models/Artwork');

async function loadOwnedArtwork(req, res, next) {
    try {
        if (!mongoose.isValidObjectId(req.params.id)) {
            return res.status(404).json({ error: 'Artwork not found' });
        }

        const artwork = await Artwork.findById(req.params.id);
        if (!artwork) {
            return res.status(404).json({ error: 'Artwork not found' });
        }

        if (artwork.artist.toString() !== req.user.userId) {
            return res.status(403).json({ error: 'You can only modify your own listing' });
        }

        req.artwork = artwork;
        next();
    } catch {
        res.status(500).json({
            error: 'Failed to load artwork'
        });
    }
}

module.exports = loadOwnedArtwork;
