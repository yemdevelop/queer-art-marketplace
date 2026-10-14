const express = require('express');

const router = express.Router();
const mongoose = require('mongoose');

const Order = require('../models/Order');
const Artwork = require('../models/Artwork');
const requireAuth = require('../middleware/auth');

router.post('/', requireAuth, async (req, res) => {
    try {
        const body = req.body ?? {};
        const artworkId = body.artworkId;
        if (!mongoose.isValidObjectId(artworkId)) {
            return res.status(404).json({ error: 'Artwork is not found' });
        }
        const artwork = await Artwork.findById(artworkId);
        if (!artwork) {
            return res.status(404).json({ error: 'Artwork not found' });
        }

        if (artwork.artist.toString() === req.user.userId) {
            return res.status(403).json({
                error: 'You cannot purchase your own artwork'
            });
        }

        if (artwork.type === 'physical' && !body.shippingAddress) {
            return res.status(400).json({
                error: 'Shipping address is required for physical artwork'
            });
        }

        if (artwork.type === 'physical') {
            const claimed = await Artwork.findOneAndUpdate(
                { _id: artworkId, status: 'available' },
                { status: 'sold' },
                { new: true }
            );

            if (!claimed) {
                return res.status(409).json({ error: 'This artwork has already been sold'});
            }
        }

        const order = new Order({
            buyer: req.user.userId,
            artwork: artwork._id,
            artist: artwork.artist,
            price: artwork.price,
            type: artwork.type,
            shippingAddress: body.shippingAddress,
        });
        await order.save();

        res.status(201).json(order);

    } catch (err){
        res.status(500).json({ error: 'Failed to create order'});
    }
});

module.exports = router;