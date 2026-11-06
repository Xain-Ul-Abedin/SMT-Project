const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect } = require('../middleware/authMiddleware');

router.post('/', protect, reviewController.createReview);
router.get('/', reviewController.getAllReviews);
router.get('/artwork/:artworkId', reviewController.getReviewsByArtwork);

module.exports = router;
