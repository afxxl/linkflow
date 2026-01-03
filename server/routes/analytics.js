const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const {
    getOverview,
    getChartData,
    getLinkAnalytics,
    getGeoAnalytics,
    getDeviceAnalytics,
    exportAnalytics
} = require('../controllers/analyticsController');

// All routes are protected
router.use(auth);

// Routes
router.get('/overview', getOverview);
router.get('/chart', getChartData);
router.get('/links/:linkId', getLinkAnalytics);
router.get('/geo', getGeoAnalytics);
router.get('/devices', getDeviceAnalytics);
router.get('/export', exportAnalytics);

module.exports = router;
