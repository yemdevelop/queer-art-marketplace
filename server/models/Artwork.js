const mongoose = require('mongoose');

const artworkSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    price: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['digital', 'physical'], required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    status: { type: String, enum: ['available', 'sold'], default: 'available' },

    weight: { type: Number },
    dimensions: {
        length: { type: Number },
        width: { type: Number },
        height: { type: Number },
    },

    file: { type: String, select: false },
    editionSize: { type: Number },
    editionsSold: { type: Number, default: 0 },
    downloadLimit: { type: Number },
}, { timestamps: true });

module.exports = mongoose.model('Artwork', artworkSchema);