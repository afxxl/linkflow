const Click = require('../models/Click');
const Link = require('../models/Link');

// @desc    Get analytics overview
// @route   GET /api/analytics/overview
// @access  Private
const getOverview = async (req, res) => {
    try {
        const userId = req.user._id;

        // Total clicks
        const totalClicks = await Click.countDocuments({ userId });

        // Unique visitors (unique IP addresses)
        const uniqueVisitors = await Click.distinct('ipAddress', { userId });

        // Top links
        const topLinks = await Click.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: '$linkId',
                    clicks: { $sum: 1 }
                }
            },
            { $sort: { clicks: -1 } },
            { $limit: 5 },
            {
                $lookup: {
                    from: 'links',
                    localField: '_id',
                    foreignField: '_id',
                    as: 'link'
                }
            },
            { $unwind: '$link' },
            {
                $project: {
                    linkId: '$_id',
                    title: '$link.title',
                    url: '$link.url',
                    clicks: 1,
                    _id: 0
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                totalClicks,
                uniqueVisitors: uniqueVisitors.length,
                topLinks
            }
        });
    } catch (error) {
        console.error('Get overview error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching analytics overview'
        });
    }
};

// @desc    Get clicks over time chart data
// @route   GET /api/analytics/chart?days=7
// @access  Private
const getChartData = async (req, res) => {
    try {
        const userId = req.user._id;
        const days = parseInt(req.query.days) || 7;

        // Calculate date range
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);

        const clicks = await Click.aggregate([
            {
                $match: {
                    userId,
                    timestamp: { $gte: startDate, $lte: endDate }
                }
            },
            {
                $group: {
                    _id: {
                        $dateToString: { format: '%Y-%m-%d', date: '$timestamp' }
                    },
                    count: { $sum: 1 }
                }
            },
            { $sort: { _id: 1 } }
        ]);

        // Fill in missing dates with 0 clicks
        const chartData = [];
        for (let i = 0; i < days; i++) {
            const date = new Date();
            date.setDate(date.getDate() - (days - 1 - i));
            const dateStr = date.toISOString().split('T')[0];

            const dayData = clicks.find(c => c._id === dateStr);
            chartData.push({
                date: dateStr,
                clicks: dayData ? dayData.count : 0
            });
        }

        res.json({
            success: true,
            data: { chartData }
        });
    } catch (error) {
        console.error('Get chart data error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching chart data'
        });
    }
};

// @desc    Get analytics for specific link
// @route   GET /api/analytics/links/:linkId
// @access  Private
const getLinkAnalytics = async (req, res) => {
    try {
        const { linkId } = req.params;
        const userId = req.user._id;

        // Verify link belongs to user
        const link = await Link.findOne({ _id: linkId, userId });
        if (!link) {
            return res.status(404).json({
                success: false,
                message: 'Link not found'
            });
        }

        // Total clicks for this link
        const totalClicks = await Click.countDocuments({ linkId });

        // Unique visitors
        const uniqueVisitors = await Click.distinct('ipAddress', { linkId });

        // Clicks by country
        const clicksByCountry = await Click.aggregate([
            { $match: { linkId: link._id } },
            {
                $group: {
                    _id: '$country',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 10 }
        ]);

        // Clicks by device
        const clicksByDevice = await Click.aggregate([
            { $match: { linkId: link._id } },
            {
                $group: {
                    _id: '$device',
                    count: { $sum: 1 }
                }
            }
        ]);

        res.json({
            success: true,
            data: {
                link: {
                    id: link._id,
                    title: link.title,
                    url: link.url
                },
                totalClicks,
                uniqueVisitors: uniqueVisitors.length,
                clicksByCountry,
                clicksByDevice
            }
        });
    } catch (error) {
        console.error('Get link analytics error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching link analytics'
        });
    }
};

// @desc    Get clicks by country
// @route   GET /api/analytics/geo
// @access  Private
const getGeoAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;

        const clicksByCountry = await Click.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: '$country',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } },
            { $limit: 20 }
        ]);

        res.json({
            success: true,
            data: { clicksByCountry }
        });
    } catch (error) {
        console.error('Get geo analytics error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching geo analytics'
        });
    }
};

// @desc    Get clicks by device
// @route   GET /api/analytics/devices
// @access  Private
const getDeviceAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;

        const clicksByDevice = await Click.aggregate([
            { $match: { userId } },
            {
                $group: {
                    _id: '$device',
                    count: { $sum: 1 }
                }
            },
            { $sort: { count: -1 } }
        ]);

        res.json({
            success: true,
            data: { clicksByDevice }
        });
    } catch (error) {
        console.error('Get device analytics error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching device analytics'
        });
    }
};

// @desc    Export analytics as CSV
// @route   GET /api/analytics/export
// @access  Private
const exportAnalytics = async (req, res) => {
    try {
        const userId = req.user._id;

        // Get all links with click counts
        const links = await Link.find({ userId }).select('title url clickCount');

        // Create CSV content
        let csv = 'Link Title,URL,Total Clicks\n';
        links.forEach(link => {
            csv += `"${link.title}","${link.url}",${link.clickCount}\n`;
        });

        res.setHeader('Content-Type', 'text/csv');
        res.setHeader('Content-Disposition', 'attachment; filename=linkflow-analytics.csv');
        res.send(csv);
    } catch (error) {
        console.error('Export analytics error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error exporting analytics'
        });
    }
};

module.exports = {
    getOverview,
    getChartData,
    getLinkAnalytics,
    getGeoAnalytics,
    getDeviceAnalytics,
    exportAnalytics
};
