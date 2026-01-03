const express = require('express');
const router = express.Router();
const { publicRateLimiter } = require('../middleware/rateLimiter');
const {
    getPublicProfile,
    redirectLink
} = require('../controllers/publicController');

// Apply rate limiting to public routes
router.use(publicRateLimiter);

// Routes
router.get('/r/:linkId', redirectLink);
router.get('/:username', getPublicProfile);

module.exports = router;
