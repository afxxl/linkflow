const User = require('../models/User');
const Link = require('../models/Link');
const Click = require('../models/Click');
const { getLocationFromIP } = require('../utils/geoLocation');
const { parseUserAgent } = require('../utils/deviceDetection');
const { isWithinSchedule } = require('../utils/validators');

// @desc    Get public profile page data
// @route   GET /:username
// @access  Public
const getPublicProfile = async (req, res) => {
    try {
        const { username } = req.params;

        // Find user
        const user = await User.findOne({ username }).select('username theme');

        if (!user) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        // Get all active links
        const links = await Link.find({
            userId: user._id,
            isActive: true
        })
            .sort({ position: 1 })
            .select('title url icon position');

        res.json({
            success: true,
            data: {
                user: {
                    username: user.username,
                    theme: user.theme
                },
                links
            }
        });
    } catch (error) {
        console.error('Get public profile error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error fetching profile'
        });
    }
};

// @desc    Redirect with click tracking and automation
// @route   GET /r/:linkId
// @access  Public
const redirectLink = async (req, res) => {
    try {
        const { linkId } = req.params;

        // Find link
        const link = await Link.findById(linkId);

        if (!link) {
            return res.status(404).json({
                success: false,
                message: 'Link not found'
            });
        }

        // Check if link is active
        if (!link.isActive) {
            return res.status(404).json({
                success: false,
                message: 'Link is not active'
            });
        }

        // Get request metadata
        const ipAddress = req.ip || req.connection.remoteAddress || null;
        const userAgent = req.headers['user-agent'] || null;
        const referrer = req.headers.referer || req.headers.referrer || null;

        // Parse location and device info
        const { country, city } = getLocationFromIP(ipAddress);
        const { device, browser, os } = parseUserAgent(userAgent);

        // AUTOMATION CHECKS

        // 1. Check schedule automation
        if (link.schedule.enabled) {
            if (!link.schedule.startDate || !link.schedule.endDate) {
                console.log('Schedule enabled but dates not set for link:', linkId);
            } else {
                const withinSchedule = isWithinSchedule(
                    link.schedule.startDate,
                    link.schedule.endDate
                );

                if (!withinSchedule) {
                    console.log('Link outside schedule:', linkId);
                    return res.status(404).json({
                        success: false,
                        message: 'Link is not available at this time'
                    });
                }
            }
        }

        // 2. Check geo-targeting automation
        if (link.geoTargeting.enabled && country) {
            const { countries, action } = link.geoTargeting;

            if (countries && countries.length > 0) {
                const countryMatch = countries.includes(country);

                if (action === 'show' && !countryMatch) {
                    console.log('Geo-targeting: country not in show list:', country);
                    return res.status(404).json({
                        success: false,
                        message: 'Link not available in your region'
                    });
                }

                if (action === 'hide' && countryMatch) {
                    console.log('Geo-targeting: country in hide list:', country);
                    return res.status(404).json({
                        success: false,
                        message: 'Link not available in your region'
                    });
                }
            }
        }

        // 3. Check device targeting automation
        if (link.deviceTargeting.enabled && device) {
            const { devices } = link.deviceTargeting;

            if (devices && devices.length > 0) {
                const deviceMatch = devices.includes(device);

                if (!deviceMatch) {
                    console.log('Device targeting: device not in list:', device);
                    return res.status(404).json({
                        success: false,
                        message: 'Link not available on this device'
                    });
                }
            }
        }

        // 4. Handle URL rotation
        let finalUrl = link.url;
        let rotatedUrl = null;

        if (link.rotation.enabled && link.rotation.urls && link.rotation.urls.length > 0) {
            const urls = link.rotation.urls;

            if (link.rotation.method === 'random') {
                // Random selection
                const randomIndex = Math.floor(Math.random() * urls.length);
                finalUrl = urls[randomIndex];
                rotatedUrl = finalUrl;
            } else if (link.rotation.method === 'sequential') {
                // Sequential rotation
                const currentIndex = link.rotation.currentIndex || 0;
                finalUrl = urls[currentIndex];
                rotatedUrl = finalUrl;

                // Update index for next click (async, don't wait)
                const nextIndex = (currentIndex + 1) % urls.length;
                Link.updateOne(
                    { _id: linkId },
                    { 'rotation.currentIndex': nextIndex }
                ).catch(err => console.error('Error updating rotation index:', err));
            }
        }

        // 5. Record click (async, don't delay redirect)
        const clickData = {
            linkId: link._id,
            userId: link.userId,
            ipAddress,
            country,
            city,
            device,
            browser,
            os,
            referrer,
            userAgent,
            rotatedUrl
        };

        // Create click record and increment click count (async)
        Click.create(clickData).catch(err =>
            console.error('Error recording click:', err)
        );

        Link.updateOne(
            { _id: linkId },
            { $inc: { clickCount: 1 } }
        ).catch(err =>
            console.error('Error incrementing click count:', err)
        );

        // 6. Redirect to final URL
        res.redirect(finalUrl);

    } catch (error) {
        console.error('Redirect link error:', error);
        res.status(500).json({
            success: false,
            message: error.message || 'Error processing redirect'
        });
    }
};

module.exports = {
    getPublicProfile,
    redirectLink
};
