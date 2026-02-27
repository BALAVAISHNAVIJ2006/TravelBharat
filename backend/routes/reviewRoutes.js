const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { protect, admin } = require('../middleware/auth');
const { validateReview, validateId } = require('../middleware/validation');

// Public routes
router.get('/place/:placeId', reviewController.getReviewsByPlace);

// Protected routes (require authentication)
router.post('/', protect, validateReview, reviewController.createReview);
router.get('/my-reviews', protect, reviewController.getUserReviews);
router.put('/:id', protect, validateId, validateReview, reviewController.updateReview);
router.delete('/:id', protect, validateId, reviewController.deleteReview);

// Admin routes
router.get('/all', protect, admin, reviewController.getAllReviews);

module.exports = router;
