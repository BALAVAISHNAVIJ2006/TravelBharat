const mongoose = require('mongoose');

const ReviewSchema = new mongoose.Schema({
  userId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  placeId: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Place', 
    required: true 
  },
  rating: { 
    type: Number, 
    required: true, 
    min: 1, 
    max: 5 
  },
  comment: { 
    type: String, 
    required: true,
    maxlength: 1000
  },
  language: { 
    type: String, 
    default: 'en',
    enum: ['en', 'hi', 'ta']
  },
  userName: { 
    type: String 
  },
  createdAt: { 
    type: Date, 
    default: Date.now 
  },
  updatedAt: { 
    type: Date, 
    default: Date.now 
  }
});

// Index for faster queries
ReviewSchema.index({ placeId: 1, createdAt: -1 });
ReviewSchema.index({ userId: 1 });

module.exports = mongoose.model('Review', ReviewSchema);
