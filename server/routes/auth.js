const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const validate = require('../middleware/validation');
const auth = require('../middleware/auth');
const { authRateLimiter } = require('../middleware/rateLimiter');
const {
    register,
    login,
    getMe,
    updateProfile,
    changePassword
} = require('../controllers/authController');

// Validation rules
const registerValidation = [
    body('username')
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be 3-20 characters')
        .matches(/^[a-z0-9_-]+$/)
        .withMessage('Username can only contain lowercase letters, numbers, hyphens, and underscores')
        .toLowerCase(),
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail()
        .toLowerCase(),
    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters')
];

const loginValidation = [
    body('email')
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail()
        .toLowerCase(),
    body('password')
        .notEmpty()
        .withMessage('Password is required')
];

const updateProfileValidation = [
    body('username')
        .optional()
        .trim()
        .isLength({ min: 3, max: 20 })
        .withMessage('Username must be 3-20 characters')
        .matches(/^[a-z0-9_-]+$/)
        .withMessage('Username can only contain lowercase letters, numbers, hyphens, and underscores')
        .toLowerCase(),
    body('email')
        .optional()
        .trim()
        .isEmail()
        .withMessage('Please provide a valid email')
        .normalizeEmail()
        .toLowerCase()
];

const changePasswordValidation = [
    body('currentPassword')
        .notEmpty()
        .withMessage('Current password is required'),
    body('newPassword')
        .isLength({ min: 6 })
        .withMessage('New password must be at least 6 characters')
];

// Routes
router.post('/register', authRateLimiter, registerValidation, validate, register);
router.post('/login', authRateLimiter, loginValidation, validate, login);
router.get('/me', auth, getMe);
router.put('/update-profile', auth, updateProfileValidation, validate, updateProfile);
router.put('/change-password', auth, changePasswordValidation, validate, changePassword);

module.exports = router;
