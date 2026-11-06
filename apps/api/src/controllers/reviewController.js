const mongoose = require('mongoose');
const Review = require('../models/Review');
const Artwork = require('../models/Artwork');
const memoryStore = require('../models/memoryStore');

/**
 * Submit Verified Review
 * POST /api/v1/reviews
 * Access: Authenticated Customer / User
 */
exports.createReview = async (req, res) => {
    try {
        const { artworkId, rating, comment } = req.body;

        if (!artworkId || !rating || !comment) {
            return res.status(400).json({
                success: false,
                message: 'Artwork ID, rating (1-5), and qualitative comment are required.'
            });
        }

        const ratingNum = parseInt(rating, 10);
        if (isNaN(ratingNum) || ratingNum < 1 || ratingNum > 5) {
            return res.status(400).json({
                success: false,
                message: 'Rating must be an integer between 1 and 5.'
            });
        }

        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            const artwork = await Artwork.findOne({
                $or: [{ _id: mongoose.Types.ObjectId.isValid(artworkId) ? artworkId : null }, { artworkId }]
            });

            if (!artwork) {
                return res.status(404).json({ success: false, message: 'Artwork not found.' });
            }

            const review = await Review.create({
                customer: req.user._id,
                customerName: req.user.name || 'Verified Collector',
                artwork: artwork._id,
                artworkId: artwork.artworkId,
                rating: ratingNum,
                comment,
                isVerifiedPurchase: true
            });

            return res.status(201).json({
                success: true,
                message: 'Review recorded successfully.',
                data: review
            });
        } else {
            // MemoryStore Fallback
            const artwork = memoryStore.findArtworkById(artworkId);
            if (!artwork) {
                return res.status(404).json({ success: false, message: 'Artwork not found.' });
            }

            const review = memoryStore.addReview({
                customer: req.user.id || req.user._id,
                customerName: req.user.name || 'Verified Collector',
                artwork: artwork._id || artwork.id,
                artworkId: artwork.artworkId || artwork._id || artwork.id,
                rating: ratingNum,
                comment,
                isVerifiedPurchase: true
            });

            return res.status(201).json({
                success: true,
                message: 'Review recorded successfully.',
                data: review
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Get Reviews by Artwork
 * GET /api/v1/reviews/artwork/:artworkId
 * Access: Public
 */
exports.getReviewsByArtwork = async (req, res) => {
    try {
        const { artworkId } = req.params;
        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            const reviews = await Review.find({
                $or: [{ artwork: mongoose.Types.ObjectId.isValid(artworkId) ? artworkId : null }, { artworkId }]
            }).sort({ createdAt: -1 });

            return res.status(200).json({
                success: true,
                count: reviews.length,
                data: reviews
            });
        } else {
            // MemoryStore Fallback
            const reviews = memoryStore.findReviewsByArtwork(artworkId);
            return res.status(200).json({
                success: true,
                count: reviews.length,
                data: reviews
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};

/**
 * Get All Reviews (Gallery Feedback Stream)
 * GET /api/v1/reviews
 * Access: Public
 */
exports.getAllReviews = async (req, res) => {
    try {
        const isMongoConnected = mongoose.connection.readyState === 1;

        if (isMongoConnected) {
            const reviews = await Review.find().sort({ createdAt: -1 }).limit(50);
            return res.status(200).json({
                success: true,
                count: reviews.length,
                data: reviews
            });
        } else {
            return res.status(200).json({
                success: true,
                count: memoryStore.reviews.length,
                data: memoryStore.reviews
            });
        }
    } catch (err) {
        return res.status(500).json({ success: false, message: err.message });
    }
};
