const mongoose = require('mongoose');
const Artwork = require('../models/Artwork');
const Review = require('../models/Review');
const memoryStore = require('../models/memoryStore');

/**
 * Get Artwork Catalog (Faceted Search)
 * GET /api/v1/artworks
 */
exports.getArtworks = async (req, res) => {
    try {
        const { medium, minPrice, maxPrice, status, featured, search } = req.query;
        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            let filter = {};

            // Public views default to AVAILABLE unless explicitly filtered
            if (status) {
                if (status !== 'ALL') filter.status = status;
            } else {
                filter.status = 'AVAILABLE';
            }

            if (medium && medium !== 'All') {
                filter.medium = medium;
            }

            if (featured !== undefined) {
                filter.featured = featured === 'true';
            }

            if (minPrice || maxPrice) {
                filter.priceCents = {};
                if (minPrice) filter.priceCents.$gte = Number(minPrice);
                if (maxPrice) filter.priceCents.$lte = Number(maxPrice);
            }

            if (search) {
                filter.$or = [
                    { title: { $regex: search, $options: 'i' } },
                    { artistName: { $regex: search, $options: 'i' } },
                    { medium: { $regex: search, $options: 'i' } }
                ];
            }

            const artworks = await Artwork.find(filter).sort({ createdAt: -1 });
            return res.status(200).json({
                success: true,
                count: artworks.length,
                data: artworks
            });
        } else {
            // MemoryStore Dual-Mode Fallback
            let list = memoryStore.findArtworks();

            if (status) {
                if (status !== 'ALL') list = list.filter(a => a.status === status);
            } else {
                list = list.filter(a => a.status === 'AVAILABLE');
            }

            if (medium && medium !== 'All') {
                list = list.filter(a => a.medium.toLowerCase() === medium.toLowerCase());
            }

            if (featured !== undefined) {
                const isFeatured = featured === 'true';
                list = list.filter(a => a.featured === isFeatured);
            }

            if (minPrice) {
                list = list.filter(a => a.priceCents >= Number(minPrice));
            }
            if (maxPrice) {
                list = list.filter(a => a.priceCents <= Number(maxPrice));
            }

            if (search) {
                const s = search.toLowerCase();
                list = list.filter(a =>
                    a.title.toLowerCase().includes(s) ||
                    a.artistName.toLowerCase().includes(s) ||
                    a.medium.toLowerCase().includes(s)
                );
            }

            return res.status(200).json({
                success: true,
                count: list.length,
                data: list
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Get Artwork Details by ID
 * GET /api/v1/artworks/:id
 */
exports.getArtworkById = async (req, res) => {
    try {
        const { id } = req.params;
        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            let artwork = null;
            if (mongoose.Types.ObjectId.isValid(id)) {
                artwork = await Artwork.findById(id).populate('artist', 'name avatarUrl artistProfile');
            }
            if (!artwork) {
                artwork = await Artwork.findOne({ artworkId: id }).populate('artist', 'name avatarUrl artistProfile');
            }

            if (!artwork) {
                return res.status(404).json({ success: false, message: 'Artwork not found.' });
            }

            const reviews = await Review.find({ artwork: artwork._id }).sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                data: artwork,
                reviews
            });
        } else {
            // MemoryStore Dual-Mode Fallback
            const artwork = memoryStore.findArtworkById(id);
            if (!artwork) {
                return res.status(404).json({ success: false, message: 'Artwork not found.' });
            }

            const reviews = memoryStore.findReviewsByArtwork(artwork.artworkId || artwork._id);

            return res.status(200).json({
                success: true,
                data: artwork,
                reviews
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Create Artwork (Artist Submission)
 * POST /api/v1/artworks
 */
exports.createArtwork = async (req, res) => {
    try {
        const {
            artworkId,
            title,
            medium,
            dimensions,
            priceCents,
            priceUSD,
            stock,
            images,
            description,
            provenance,
            framingOptions
        } = req.body;

        if (!title) {
            return res.status(400).json({ success: false, message: 'Artwork title is required.' });
        }

        // Calculate Integer Cents
        let finalCents = 0;
        if (priceCents) {
            finalCents = Math.round(Number(priceCents));
        } else if (priceUSD) {
            finalCents = Math.round(Number(priceUSD) * 100);
        } else {
            return res.status(400).json({ success: false, message: 'Price is required (either priceCents or priceUSD).' });
        }

        const generatedId = artworkId || `ART-${Math.floor(100 + Math.random() * 900)}`;
        
        // Strict Curatorial Approval Invariant:
        // Admin creations can be AVAILABLE immediately; Artist submissions are strictly PENDING_APPROVAL.
        const initialStatus = req.user.role === 'admin' ? (req.body.status || 'AVAILABLE') : 'PENDING_APPROVAL';

        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            const artwork = await Artwork.create({
                artworkId: generatedId,
                title,
                artistName: req.user.name,
                artist: req.user._id,
                medium: medium || 'Oil on Linen',
                dimensions: dimensions || '24 x 36 inches',
                priceCents: finalCents,
                stock: stock !== undefined ? Number(stock) : 1,
                status: initialStatus,
                images: images && images.length ? images : ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'],
                description: description || 'Curated independent masterpiece.',
                provenance: provenance || `Submitted by ${req.user.name}.`,
                framingOptions: framingOptions || 'Custom Walnut Float Frame'
            });

            return res.status(201).json({
                success: true,
                message: initialStatus === 'PENDING_APPROVAL' 
                    ? 'Artwork submitted for curatorial review.' 
                    : 'Artwork listing published successfully.',
                data: artwork
            });
        } else {
            // MemoryStore Dual-Mode Fallback
            const artwork = memoryStore.addArtwork({
                artworkId: generatedId,
                title,
                artistName: req.user.name,
                artist: req.user.id || req.user._id,
                medium: medium || 'Oil on Linen',
                dimensions: dimensions || '24 x 36 inches',
                priceCents: finalCents,
                stock: stock !== undefined ? Number(stock) : 1,
                status: initialStatus,
                images: images && images.length ? images : ['https://images.unsplash.com/photo-1579783900882-c0d3dad7b119?auto=format&fit=crop&w=1200&q=80'],
                description: description || 'Curated independent masterpiece.',
                provenance: provenance || `Submitted by ${req.user.name}.`,
                framingOptions: framingOptions || 'Custom Walnut Float Frame'
            });

            return res.status(201).json({
                success: true,
                message: initialStatus === 'PENDING_APPROVAL' 
                    ? 'Artwork submitted for curatorial review.' 
                    : 'Artwork listing published successfully.',
                data: artwork
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Update Artwork
 * PUT /api/v1/artworks/:id
 */
exports.updateArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        const updates = req.body;
        const isMongoConnected = mongoose.connection.readyState === 1;

        if (updates.priceUSD && !updates.priceCents) {
            updates.priceCents = Math.round(Number(updates.priceUSD) * 100);
        }

        if (isMongoConnected) {
            let artwork = null;
            if (mongoose.Types.ObjectId.isValid(id)) {
                artwork = await Artwork.findById(id);
            }
            if (!artwork) {
                artwork = await Artwork.findOne({ artworkId: id });
            }

            if (!artwork) {
                return res.status(404).json({ success: false, message: 'Artwork not found.' });
            }

            // Authorization check: Only Admin or the owning Artist can update
            if (req.user.role !== 'admin' && artwork.artist && artwork.artist.toString() !== req.user._id.toString()) {
                return res.status(403).json({ success: false, message: 'Not authorized to modify this artwork.' });
            }

            Object.assign(artwork, updates);
            await artwork.save();

            return res.status(200).json({
                success: true,
                message: 'Artwork updated successfully.',
                data: artwork
            });
        } else {
            // MemoryStore Dual-Mode Fallback
            const artwork = memoryStore.findArtworkById(id);
            if (!artwork) {
                return res.status(404).json({ success: false, message: 'Artwork not found.' });
            }

            const updated = memoryStore.updateArtwork(artwork.artworkId || artwork._id, updates);
            return res.status(200).json({
                success: true,
                message: 'Artwork updated successfully.',
                data: updated
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Delete Artwork
 * DELETE /api/v1/artworks/:id
 */
exports.deleteArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            const artwork = await Artwork.findOneAndDelete({
                $or: [{ _id: mongoose.Types.ObjectId.isValid(id) ? id : null }, { artworkId: id }]
            });

            if (!artwork) {
                return res.status(404).json({ success: false, message: 'Artwork not found.' });
            }

            return res.status(200).json({ success: true, message: 'Artwork record removed successfully.' });
        } else {
            const artwork = memoryStore.findArtworkById(id);
            if (!artwork) {
                return res.status(404).json({ success: false, message: 'Artwork not found.' });
            }
            const idx = memoryStore.artworks.findIndex(a => a.artworkId === artwork.artworkId || a._id === artwork._id);
            if (idx !== -1) memoryStore.artworks.splice(idx, 1);

            return res.status(200).json({ success: true, message: 'Artwork record removed successfully.' });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
