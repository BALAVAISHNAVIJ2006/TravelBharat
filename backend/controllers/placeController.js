const Place = require('../models/Place');

exports.getAllPlaces = async (req, res) => {
  try {
    const places = await Place.find();
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPlacesByState = async (req, res) => {
  try {
    const places = await Place.find({ state: req.params.state });
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

exports.getPlaceById = async (req, res) => {
  try {
    const place = await Place.findById(req.params.id);
    if (!place) return res.status(404).json({ message: 'Place not found' });
    res.json(place);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const { normalizeCategory, categoryFilterRegex } = require('../utils/categoryHelper');

exports.searchPlaces = async (req, res) => {
  let { query, category, state, city, minRating, sort = '-averageRating', page = 1, limit = 20 } = req.query;
  try {
    const filter = {};

    if (query) {
      filter.$or = [
        { name: { $regex: query, $options: 'i' } },
        { state: { $regex: query, $options: 'i' } },
        { city: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
      ];
    }

    if (category) {
      filter.category = categoryFilterRegex(category);
    }
    if (state) filter.state = state;
    if (city) filter.city = city;
    if (minRating) filter.averageRating = { $gte: parseFloat(minRating) };

    const places = await Place.find(filter)
      .sort(sort)
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Place.countDocuments(filter);

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

// Get featured places (top rated)
exports.getFeaturedPlaces = async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const places = await Place.find({ totalReviews: { $gte: 1 } })
      .sort('-averageRating -totalReviews')
      .limit(parseInt(limit));
    res.json(places);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get places by category
exports.getPlacesByCategory = async (req, res) => {
  try {
    let { category } = req.params;
    const { page = 1, limit = 20 } = req.query;
    category = normalizeCategory(category);
    const places = await Place.find({ category: categoryFilterRegex(category) })
      .sort('-averageRating')
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    const total = await Place.countDocuments({ category: categoryFilterRegex(category) });

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

// Get all unique states with place counts and representative image
exports.getStates = async (req, res) => {
  try {
    // Aggregate states and choose the first available image from any place in the state.
    // We push all `images` arrays, flatten them, and select the first element if present.
    const states = await Place.aggregate([
      { $group: {
          _id: '$state',
          count: { $sum: 1 },
          allImages: { $push: '$images' }
        }
      },
      { $project: {
          _id: 1,
          count: 1,
          // Flatten the array-of-arrays into a single array of urls
          flattened: {
            $reduce: {
              input: '$allImages',
              initialValue: [],
              in: { $concatArrays: ['$$value', { $ifNull: ['$$this', []] }] }
            }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    res.json(states.map(s => ({
      state: s._id,
      count: s.count,
      image: Array.isArray(s.flattened) && s.flattened.length > 0 ? s.flattened[0] : null
    })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get cities by state
exports.getCitiesByState = async (req, res) => {
  try {
    const { state } = req.params;
    const cities = await Place.aggregate([
      { $match: { state } },
      { $group: { _id: '$city', count: { $sum: 1 } } },
      { $sort: { _id: 1 } }
    ]);
    res.json(cities.map(c => ({ city: c._id, count: c.count })));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Increment view count
exports.incrementViews = async (req, res) => {
  try {
    const { id } = req.params;
    await Place.findByIdAndUpdate(id, { $inc: { views: 1 } });
    res.json({ message: 'View count updated' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
