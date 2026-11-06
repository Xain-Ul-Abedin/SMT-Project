const mongoose = require('mongoose');

const ArtworkSchema = new mongoose.Schema({
    artworkId: {
        type: String,
        required: [true, 'Artwork ID is required'],
        unique: true,
        trim: true
    },
    title: {
        type: String,
        required: [true, 'Artwork title is required'],
        trim: true,
        maxlength: [200, 'Title cannot exceed 200 characters']
    },
    artistName: {
        type: String,
        required: [true, 'Artist name is required'],
        trim: true
    },
    artist: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        default: null
    },
    medium: {
        type: String,
        required: [true, 'Artwork medium is required'],
        enum: [
            'Oil on Linen',
            'Acrylic on Canvas',
            'Watercolor on Cold-Press',
            'Digital Fine Art',
            'Bronze Sculpture',
            'Mixed Media',
            'Charcoal & Acrylic',
            'Cast Glass & Steel'
        ],
        default: 'Oil on Linen'
    },
    dimensions: {
        type: String,
        required: [true, 'Physical dimensions are required'],
        default: '24 x 36 inches'
    },
    priceCents: {
        type: Number,
        required: [true, 'Price in integer cents is required'],
        min: [100, 'Price must be at least $1.00 (100 cents)'],
        validate: {
            validator: Number.isInteger,
            message: 'priceCents must be a whole integer value'
        }
    },
    stock: {
        type: Number,
        required: true,
        default: 1,
        min: [0, 'Stock cannot be negative'],
        validate: {
            validator: Number.isInteger,
            message: 'Stock must be a whole integer value'
        }
    },
    status: {
        type: String,
        enum: ['PENDING_APPROVAL', 'AVAILABLE', 'RESERVED', 'SOLD', 'ARCHIVED'],
        default: 'PENDING_APPROVAL'
    },
    images: {
        type: [String],
        default: [
            'https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'
        ]
    },
    description: {
        type: String,
        default: 'Original curated masterpiece created by independent visual artist.'
    },
    provenance: {
        type: String,
        default: 'Acquired directly from the artist studio atelier.'
    },
    framingOptions: {
        type: String,
        enum: ['Unframed Canvas', 'Custom Walnut Float Frame', 'Matte Obsidian Gallery Frame', 'Museum Acrylic Case'],
        default: 'Custom Walnut Float Frame'
    },
    certificateOfAuthenticity: {
        issued: { type: Boolean, default: true },
        certNumber: { type: String, default: () => `COA-${Math.floor(100000 + Math.random() * 900000)}` },
        signedBy: { type: String, default: 'Arts Gallery Chief Curator' }
    },
    featured: {
        type: Boolean,
        default: false
    }
}, {
    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

// Virtual getter for decimal USD valuation
ArtworkSchema.virtual('priceUSD').get(function () {
    return (this.priceCents / 100).toFixed(2);
});

// Virtual getter for formatted currency string
ArtworkSchema.virtual('priceFormatted').get(function () {
    return `$${(this.priceCents / 100).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;
});

// Lifecycle transition hook: Auto-mark as SOLD when stock drops to 0
ArtworkSchema.pre('save', function (next) {
    if (this.stock === 0 && this.status === 'AVAILABLE') {
        this.status = 'SOLD';
    }
    next();
});

module.exports = mongoose.model('Artwork', ArtworkSchema);
