require('dotenv').config();
const mongoose = require('mongoose');
const csv = require('csv-parser');
const fs = require('fs');
const Place = require('./models/Place');
const connectDB = require('./config/db');
const { normalizeCategory } = require('./utils/categoryHelper');

connectDB();

// unsplash configuration used for automatic cover fetching
const axios = require('axios');
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const DELAY_MS = parseInt(process.env.FETCH_COVERS_DELAY_MS, 10) || 800; // polite delay

if (!UNSPLASH_KEY) {
  console.warn('UNSPLASH_ACCESS_KEY not set; covers will not be fetched automatically.');
}

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const fetchCoverFor = async (title) => {
  if (!UNSPLASH_KEY) return null;
  try {
    const q = `${title} India landmark`;
    const res = await axios.get(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape&content_filter=high`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    );
    if (res.data && res.data.results && res.data.results[0]) {
      return res.data.results[0].urls.regular;
    }
  } catch (err) {
    console.warn('Error fetching cover for', title, err.message || err);
  }
  return null;
};

const addUnplashCovers = async () => {
  if (!UNSPLASH_KEY) return;
  const needs = await Place.find({ $or: [ { images: { $exists: false } }, { images: { $size: 0 } } ] }).lean();
  console.log(`${needs.length} inserted places lack images; fetching covers...`);
  for (const p of needs) {
    const title = p.name || `${p.city || ''} ${p.state || ''}`.trim() || 'India';
    const cover = await fetchCoverFor(title);
    if (cover) {
      await Place.updateOne({ _id: p._id }, { $set: { images: [cover] } });
      console.log('Saved cover for', title);
    }
    await sleep(DELAY_MS);
  }
};
const importCSV = (filePath, mapping) => {
  return new Promise((resolve, reject) => {
    const results = [];
    fs.createReadStream(filePath)
      .pipe(csv())
      .on('data', (data) => {
        const mappedData = mapping(data);
        if (mappedData) results.push(mappedData);
      })
      .on('end', () => resolve(results))
      .on('error', reject);
  });
};

const mappings = {
  'Top Indian Places to Visit.csv': (data) => ({
    name: data.Name || '',
    state: data.State || '',
    city: data.City || '',
    category: normalizeCategory(data.Type || ''),
    description: data.Significance || data.Type || 'No description',
    bestTimeToVisit: data['Best Time to visit'] || 'Anytime',
    entryFees: data['Entrance Fee in INR'] || '',
    timings: data['Weekly Off'] ? `Closed on ${data['Weekly Off']}` : '',
    images: [], // Placeholder
    nearbyAttractions: [], // Placeholder
    location: '', // Placeholder
  }),
  'City.csv': (data) => {
    // Infer state from desc (simple regex example; improve if needed)
    const stateMatch = data.City_desc?.match(/(Himachal|Karnataka|Kerala|etc.)/i); // Add more states
    return {
      name: data.City || '',
      state: stateMatch ? stateMatch[0] : 'Unknown',
      city: data.City || '',
      category: normalizeCategory('General'),
      description: data.City_desc || 'No description',
      bestTimeToVisit: data.Best_time_to_visit || 'Anytime',
      entryFees: '',
      timings: '',
      images: [],
      nearbyAttractions: [],
      location: '',
    };
  },
  'places.csv': (data) => ({ // CSV columns: state,city,popular_destination,latitude,longitude,interest,google_rating,price_fare
    name: data.popular_destination || '',
    state: data.state || '',
    city: data.city || '',
    category: normalizeCategory(data.interest || ''),
    description: `Rating: ${data.google_rating || 'N/A'}, fare: ${data.price_fare || 'N/A'}`,
    bestTimeToVisit: 'Anytime',
    entryFees: data.price_fare || '',
    timings: '',
    images: [],
    nearbyAttractions: [],
    location: data.latitude && data.longitude ? `${data.latitude},${data.longitude}` : '',
  }),
};

async function seed() {
  try {
    await Place.deleteMany({}); // Optional: Clear DB

    for (const file of Object.keys(mappings)) {
      console.log('reading file', file);
      let data = await importCSV(file, mappings[file]);
      console.log('loaded', data.length, 'rows from', file);

      // normalize categories (in case some still slip through)
      data = data.map(d => ({ ...d, category: normalizeCategory(d.category) }));

      // insert one-by-one so one bad record doesn't stop the rest
      let successCount = 0;
      for (const doc of data) {
        if (!doc.name || !doc.state || !doc.city) continue;
        try {
          await Place.create(doc);
          successCount++;
        } catch (err) {
          console.error('Failed to insert place', doc.name || '(no name)', err.message);
        }
      }
      console.log(`${successCount} places inserted from ${file} (out of ${data.length})`);
    }

    // after seeding, fetch cover images for any place that has no images
    await addUnplashCovers();

    console.log('Import complete!');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

seed();