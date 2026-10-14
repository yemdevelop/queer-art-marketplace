const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    artwork: { type: mongoose.Schema.Types.ObjectId, ref: 'Artwork', required: true },
    artist: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    price: { type: Number, required: true, min: 0 },
    type: { type: String, enum: ['digital', 'physical'], required: true },
    shippingAddress: { 
        type: String, 
            required: function () {
            return this.type === 'physical';
            },
    },
}, { timestamps: true });

module.exports = mongoose.model('Order', orderSchema);