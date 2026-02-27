const mongoose = require('mongoose');

const PlaceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  name_hi: { type: String },
  name_ta: { type: String },
  state: { type: String, required: true },
  city: { type: String, required: true },
  // category is limited to a known set of values; keep in sync with frontend options
  category: { type: String, required: true, enum: ['Heritage', 'Nature', 'Adventure', 'Religious'] },
  description: { type: String, required: true },
  description_hi: { type: String },
  description_ta: { type: String },
  bestTimeToVisit: { type: String, required: true },
  location: { type: String },
  images: [{ type: String }],
  entryFees: { type: String },
  timings: { type: String },
  nearbyAttractions: [{ type: String }],
  averageRating: { type: Number, default: 0, min: 0, max: 5 },
  totalReviews: { type: Number, default: 0 },
  views: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

// Indexes for better query performance
PlaceSchema.index({ state: 1, city: 1 });
PlaceSchema.index({ category: 1 });
PlaceSchema.index({ averageRating: -1 });
PlaceSchema.index({ name: 'text', description: 'text' });

module.exports = mongoose.model('Place', PlaceSchema);
