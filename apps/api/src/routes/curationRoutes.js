const express = require('express');
const {
    getPendingArtworks,
    approveArtwork,
    rejectArtwork
} = require('../controllers/curationController');
const { protect, authorize } = require('../middleware/authMiddleware');

const router = express.Router();

// All curation endpoints are restricted to Admin
router.use(protect);
router.use(authorize('admin'));

router.get('/pending', getPendingArtworks);
router.put('/approve/:id', approveArtwork);
router.put('/reject/:id', rejectArtwork);

module.exports = router;
