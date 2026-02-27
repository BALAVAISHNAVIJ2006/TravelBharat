const { body, param, query } = require('express-validator');

// Place validation
exports.validatePlace = [
  body('name').trim().notEmpty().withMessage('Name is required'),
  body('state').trim().notEmpty().withMessage('State is required'),
  body('city').trim().notEmpty().withMessage('City is required'),
  body('category').trim().notEmpty().withMessage('Category is required')
    .isIn(['Heritage','Nature','Adventure','Religious']).withMessage('Invalid category'),
  body('description').trim().notEmpty().withMessage('Description is required'),
  body('bestTimeToVisit').trim().notEmpty().withMessage('Best time to visit is required'),
  body('images').optional().isArray().withMessage('Images must be an array'),
];

// Review validation
exports.validateReview = [
  body('placeId').notEmpty().withMessage('Place ID is required'),
  body('rating').isInt({ min: 1, max: 5 }).withMessage('Rating must be between 1 and 5'),
  body('comment').trim().notEmpty().withMessage('Comment is required')
    .isLength({ max: 1000 }).withMessage('Comment must not exceed 1000 characters'),
  body('language').optional().isIn(['en', 'hi', 'ta']).withMessage('Invalid language'),
];

// Auth validation
exports.validateRegister = [
  body('username').trim().notEmpty().withMessage('Username is required')
    .isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').trim().notEmpty().withMessage('Password is required')
    .isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').optional().isIn(['user', 'admin']).withMessage('Invalid role'),
];

exports.validateLogin = [
  body('username').trim().notEmpty().withMessage('Username is required'),
  body('password').trim().notEmpty().withMessage('Password is required'),
];

// ID validation
exports.validateId = [
  param('id').isMongoId().withMessage('Invalid ID format'),
];
