// run this script with `node scripts/normalizeCategories.js` from project root
// it will read all places and normalize their category field according to helper rules

require('dotenv').config();
const mongoose = require('mongoose');
const Place = require('../models/Place');
const connectDB = require('../config/db');
const { normalizeCategory, VALID_CATEGORIES } = require('../utils/categoryHelper');

(async function() {
  try {
    await connectDB();
    const places = await Place.find();
    let changed = 0;
    for (const p of places) {
      const norm = normalizeCategory(p.category);
      if (norm !== p.category) {
        p.category = norm;
        await p.save();
        changed++;
      }
    }
    console.log(`Normalized categories for ${changed} places`);
  } catch (err) {
    console.error(err);
  } finally {
    mongoose.disconnect();
  }
})();
