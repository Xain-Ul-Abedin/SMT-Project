const express = require('express');
const {
    getArtworks,
    getArtworkById,
    createArtwork,
    updateArtwork,
    deleteArtwork
} = require('../controllers/artworkController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// Public routes
router.get('/', getArtworks);
router.get('/:id', getArtworkById);

// Protected routes (Artists & Admins)
router.post('/', protect, authorize('artist', 'admin'), createArtwork);
router.put('/:id', protect, authorize('artist', 'admin'), updateArtwork);
router.delete('/:id', protect, authorize('admin'), deleteArtwork);

module.exports = router;
