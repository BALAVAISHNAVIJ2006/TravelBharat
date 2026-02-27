const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
const { protect, admin } = require('../middleware/auth');
const { validatePlace, validateId } = require('../middleware/validation');

// Dashboard stats
router.get('/stats', protect, admin, adminController.getStats);

// Place management
router.get('/places', protect, admin, adminController.getAllPlaces);
router.post('/places', protect, admin, validatePlace, adminController.addPlace);
router.put('/places/:id', protect, admin, validateId, validatePlace, adminController.updatePlace);
router.delete('/places/:id', protect, admin, validateId, adminController.deletePlace);

// User management
router.get('/users', protect, admin, adminController.getAllUsers);
router.put('/users/role', protect, admin, adminController.updateUserRole);

module.exports = router;
