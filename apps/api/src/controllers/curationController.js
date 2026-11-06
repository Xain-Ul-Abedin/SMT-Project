const mongoose = require('mongoose');
const Artwork = require('../models/Artwork');
const memoryStore = require('../models/memoryStore');

/**
 * Get Artworks Pending Curatorial Review
 * GET /api/v1/curation/pending
 * Access: Admin Only
 */
exports.getPendingArtworks = async (req, res) => {
    try {
        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            const pending = await Artwork.find({ status: 'PENDING_APPROVAL' })
                .populate('artist', 'name email avatarUrl artistProfile')
                .sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                count: pending.length,
                data: pending
            });
        } else {
            // MemoryStore Dual-Mode Fallback
            const pending = memoryStore.findArtworks({ status: 'PENDING_APPROVAL' });
            return res.status(200).json({
                success: true,
                count: pending.length,
                data: pending
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Approve Artwork for Public Exhibition
 * PUT /api/v1/curation/approve/:id
 * Access: Admin Only
 */
exports.approveArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        const isMongoConnected = mongoose.connection.readyState === 1;

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

            artwork.status = 'AVAILABLE';
            artwork.certificateOfAuthenticity = {
                issued: true,
                certNumber: `COA-${Math.floor(100000 + Math.random() * 900000)}`,
                signedBy: req.user.name || 'Arts Gallery Chief Curator'
            };

            await artwork.save();

            return res.status(200).json({
                success: true,
                message: `Artwork [${artwork.title}] successfully approved for public exhibition.`,
                data: artwork
            });
        } else {
            // MemoryStore Dual-Mode Fallback
            const artwork = memoryStore.findArtworkById(id);
            if (!artwork) {
                return res.status(404).json({ success: false, message: 'Artwork not found.' });
            }

            const updated = memoryStore.updateArtwork(artwork.artworkId || artwork._id, {
                status: 'AVAILABLE',
                certificateOfAuthenticity: {
                    issued: true,
                    certNumber: `COA-${Math.floor(100000 + Math.random() * 900000)}`,
                    signedBy: req.user.name || 'Arts Gallery Chief Curator'
                }
            });

            return res.status(200).json({
                success: true,
                message: `Artwork [${updated.title}] successfully approved for public exhibition.`,
                data: updated
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Reject / Archive Artwork Listing
 * PUT /api/v1/curation/reject/:id
 * Access: Admin Only
 */
exports.rejectArtwork = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        const isMongoConnected = mongoose.connection.readyState === 1;

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

            artwork.status = 'ARCHIVED';
            await artwork.save();

            return res.status(200).json({
                success: true,
                message: `Artwork [${artwork.title}] rejected and archived. Reason: ${reason || 'Does not meet curation guidelines.'}`,
                data: artwork
            });
        } else {
            // MemoryStore Dual-Mode Fallback
            const artwork = memoryStore.findArtworkById(id);
            if (!artwork) {
                return res.status(404).json({ success: false, message: 'Artwork not found.' });
            }

            const updated = memoryStore.updateArtwork(artwork.artworkId || artwork._id, {
                status: 'ARCHIVED'
            });

            return res.status(200).json({
                success: true,
                message: `Artwork [${updated.title}] rejected and archived. Reason: ${reason || 'Does not meet curation guidelines.'}`,
                data: updated
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
