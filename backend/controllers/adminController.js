const Place = require('../models/Place');
const User = require('../models/User');
const Review = require('../models/Review');
const { validationResult } = require('express-validator');

// Add place
const { normalizeCategory, categoryFilterRegex } = require('../utils/categoryHelper');

exports.addPlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // ensure category value is one of the accepted set
    if (req.body.category) {
      req.body.category = normalizeCategory(req.body.category);
    }
    const newPlace = new Place(req.body);
    await newPlace.save();
    res.status(201).json(newPlace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Update place
exports.updatePlace = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // normalize category if it is being changed
    if (req.body.category) {
      req.body.category = normalizeCategory(req.body.category);
    }
    req.body.updatedAt = Date.now();
    const updatedPlace = await Place.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!updatedPlace) return res.status(404).json({ message: 'Place not found' });
    res.json(updatedPlace);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
};

// Delete place
exports.deletePlace = async (req, res) => {
  try {
    const deletedPlace = await Place.findByIdAndDelete(req.params.id);
    if (!deletedPlace) return res.status(404).json({ message: 'Place not found' });
    
    // Delete all reviews for this place
    await Review.deleteMany({ placeId: req.params.id });
    
    res.json({ message: 'Place deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all places with pagination for admin
exports.getAllPlaces = async (req, res) => {
  try {
    const { page = 1, limit = 20, search, category, state } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { state: { $regex: search, $options: 'i' } },
        { city: { $regex: search, $options: 'i' } }
      ];
    }

    if (category) query.category = categoryFilterRegex(category);
    if (state) query.state = state;

    const places = await Place.find(query)
      .sort('-createdAt')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Place.countDocuments(query);

    res.json({
      places,
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

// Get dashboard statistics
exports.getStats = async (req, res) => {
  try {
    const totalPlaces = await Place.countDocuments();
    const totalUsers = await User.countDocuments();
    const totalReviews = await Review.countDocuments();
    const totalViews = await Place.aggregate([
      { $group: { _id: null, total: { $sum: '$views' } } }
    ]);

    // Get recent activity
    const recentPlaces = await Place.find().sort('-createdAt').limit(5).select('name state createdAt');
    const recentReviews = await Review.find().sort('-createdAt').limit(5)
      .populate('placeId', 'name')
      .populate('userId', 'username');

    // Category distribution
    const categoryStats = await Place.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);

    // State distribution
    const stateStats = await Place.aggregate([
      { $group: { _id: '$state', count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    // Top rated places
    const topRated = await Place.find({ totalReviews: { $gte: 1 } })
      .sort('-averageRating')
      .limit(5)
      .select('name state averageRating totalReviews');

    res.json({
      overview: {
        totalPlaces,
        totalUsers,
        totalReviews,
        totalViews: totalViews[0]?.total || 0
      },
      recentActivity: {
        places: recentPlaces,
        reviews: recentReviews
      },
      analytics: {
        categoryDistribution: categoryStats,
        stateDistribution: stateStats,
        topRatedPlaces: topRated
      }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all users (admin)
exports.getAllUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    const users = await User.find()
      .select('-password')
      .sort('-_id')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await User.countDocuments();

    res.json({
      users,
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

// Update user role
exports.updateUserRole = async (req, res) => {
  try {
    const { userId, role } = req.body;
    
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
