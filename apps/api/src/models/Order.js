const mongoose = require('mongoose');

const OrderItemSchema = new mongoose.Schema({
    artwork: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Artwork',
        required: true
    },
    artworkId: { type: String, required: true },
    title: { type: String, required: true },
    priceCents: { type: Number, required: true },
    medium: { type: String, default: 'Oil on Linen' },
    framing: { type: String, default: 'Custom Walnut Float Frame' }
}, { _id: false });

const OrderSchema = new mongoose.Schema({
    orderId: {
        type: String,
        required: true,
        unique: true,
        default: () => `ORD-${Math.floor(100000 + Math.random() * 900000)}`
    },
    customer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    items: [OrderItemSchema],
    totalCents: {
        type: Number,
        required: true,
        min: 0,
        validate: {
            validator: Number.isInteger,
            message: 'totalCents must be a whole integer value'
        }
    },
    shippingAddress: {
        street: { type: String, required: true },
        city: { type: String, required: true },
        state: { type: String, default: '' },
        postalCode: { type: String, required: true },
        country: { type: String, default: 'United States' },
        recipientPhone: { type: String, default: '' }
    },
    paymentMethod: {
        type: String,
        enum: ['STRIPE_CARD', 'CASH_ON_DELIVERY'],
        default: 'STRIPE_CARD'
    },
    paymentStatus: {
        type: String,
        enum: ['PENDING', 'COMPLETED', 'REFUNDED'],
        default: 'PENDING'
    },
    shippingStatus: {
        type: String,
        enum: ['PENDING', 'IN_CURATION', 'DISPATCHED', 'DELIVERED'],
        default: 'PENDING'
    },
    trackingNumber: {
        type: String,
        default: null
    },
    deliveredAt: {
        type: Date,
        default: null
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual getter for decimal USD
OrderSchema.virtual('totalUSD').get(function () {
    return (this.totalCents / 100).toFixed(2);
});

// Virtual getter for formatted currency string
OrderSchema.virtual('totalFormatted').get(function () {
    return `$${(this.totalCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
});

module.exports = mongoose.model('Order', OrderSchema);
