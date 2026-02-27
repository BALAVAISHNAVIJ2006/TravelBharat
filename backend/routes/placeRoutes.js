const express = require('express');
const router = express.Router();
const placeController = require('../controllers/placeController');

// Order matters: specific routes before parameterized routes
router.get('/search', placeController.searchPlaces);
router.get('/featured', placeController.getFeaturedPlaces);
router.get('/states', placeController.getStates);
router.get('/category/:category', placeController.getPlacesByCategory);
router.get('/state/:state', placeController.getPlacesByState);
router.get('/cities/:state', placeController.getCitiesByState);
router.get('/', placeController.getAllPlaces);
router.get('/:id', placeController.getPlaceById);
router.post('/:id/view', placeController.incrementViews);

module.exports = router;
