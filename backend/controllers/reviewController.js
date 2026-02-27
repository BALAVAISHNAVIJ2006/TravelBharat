const Review = require('../models/Review');
const Place = require('../models/Place');
const { validationResult } = require('express-validator');

// Create a new review
exports.createReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { placeId, rating, comment, language } = req.body;
    const userId = req.user.id;
    const userName = req.user.username;

    // Check if user already reviewed this place
    const existingReview = await Review.findOne({ userId, placeId });
    if (existingReview) {
      return res.status(400).json({ message: 'You have already reviewed this place. Please update your existing review.' });
    }

    const review = new Review({
      userId,
      placeId,
      rating,
      comment,
      language: language || 'en',
      userName
    });

    await review.save();

    // Update place average rating
    await updatePlaceRating(placeId);

    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all reviews for a place
exports.getReviewsByPlace = async (req, res) => {
  try {
    const { placeId } = req.params;
    const { sort = '-createdAt', limit = 10, page = 1 } = req.query;

    const reviews = await Review.find({ placeId })
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('userId', 'username');

    const total = await Review.countDocuments({ placeId });

    res.json({
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get user's reviews
exports.getUserReviews = async (req, res) => {
  try {
    const userId = req.user.id;
    const reviews = await Review.find({ userId })
      .sort('-createdAt')
      .populate('placeId', 'name state city images');

    res.json(reviews);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update a review
exports.updateReview = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const { id } = req.params;
    const { rating, comment, language } = req.body;
    const userId = req.user.id;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review
    if (review.userId.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized to update this review' });
    }

    review.rating = rating || review.rating;
    review.comment = comment || review.comment;
    review.language = language || review.language;
    review.updatedAt = Date.now();

    await review.save();

    // Update place average rating
    await updatePlaceRating(review.placeId);

    res.json(review);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete a review
exports.deleteReview = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;
    const userRole = req.user.role;

    const review = await Review.findById(id);
    if (!review) {
      return res.status(404).json({ message: 'Review not found' });
    }

    // Check if user owns this review or is admin
    if (review.userId.toString() !== userId && userRole !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this review' });
    }

    const placeId = review.placeId;
    await Review.findByIdAndDelete(id);

    // Update place average rating
    await updatePlaceRating(placeId);

    res.json({ message: 'Review deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Helper function to update place rating
async function updatePlaceRating(placeId) {
  const reviews = await Review.find({ placeId });
  
  if (reviews.length === 0) {
    await Place.findByIdAndUpdate(placeId, {
      averageRating: 0,
      totalReviews: 0
    });
    return;
  }

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = totalRating / reviews.length;

  await Place.findByIdAndUpdate(placeId, {
    averageRating: Math.round(averageRating * 10) / 10,
    totalReviews: reviews.length
  });
}

// Get all reviews (admin)
exports.getAllReviews = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const reviews = await Review.find()
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))
      .populate('placeId', 'name state')
      .populate('userId', 'username');

    const total = await Review.countDocuments();

    res.json({
      reviews,
      pagination: {
        total,
        page: parseInt(page),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
