require('dotenv').config();
const connectDB = require('./config/db');
const Place = require('./models/Place');
const axios = require('axios');

// Config
const UNSPLASH_KEY = process.env.UNSPLASH_ACCESS_KEY || process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
const DELAY_MS = parseInt(process.env.FETCH_COVERS_DELAY_MS, 10) || 800; // polite delay between requests

if (!UNSPLASH_KEY) {
  console.error('UNSPLASH_ACCESS_KEY not set in environment. Aborting.');
  process.exit(1);
}

connectDB();

const sleep = (ms) => new Promise(res => setTimeout(res, ms));

const fetchCoverFor = async (name) => {
  try {
    const q = `${name} India landmark`;
    const res = await axios.get(
      `https://api.unsplash.com/search/photos?query=${encodeURIComponent(q)}&per_page=1&orientation=landscape&content_filter=high`,
      { headers: { Authorization: `Client-ID ${UNSPLASH_KEY}` } }
    );
    if (res.data && res.data.results && res.data.results[0]) {
      return res.data.results[0].urls.regular;
    }
  } catch (err) {
    console.warn('Unsplash fetch error for', name, err?.message || err);
  }
  return null;
};

async function run() {
  try {
    console.log('Fetching places needing cover images...');
    const all = await Place.find().lean();
    const needs = all.filter(p => !p.images || !Array.isArray(p.images) || p.images.length === 0);
    console.log(`${needs.length} places need cover images`);

    for (let i = 0; i < needs.length; i++) {
      const p = needs[i];
      const title = p.name || `${p.city || ''} ${p.state || ''}`.trim() || 'India';
      console.log(`(${i+1}/${needs.length}) fetching cover for: ${title}`);
      const cover = await fetchCoverFor(title);
      if (cover) {
        try {
          await Place.updateOne({ _id: p._id }, { $set: { images: [cover] } });
          console.log('Saved cover for', title);
        } catch (err) {
          console.error('Failed saving cover for', title, err.message || err);
        }
      } else {
        console.log('No cover found for', title);
      }

      // polite delay
      await sleep(DELAY_MS);
    }

    console.log('Done.');
    process.exit(0);
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

run();
