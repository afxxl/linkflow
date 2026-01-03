const geoip = require('geoip-lite');

/**
 * Get geographic location from IP address
 * @param {string} ip - IP address
 * @returns {object} - Location data with country and city
 */
const getLocationFromIP = (ip) => {
    try {
        // Handle localhost and private IPs
        if (!ip || ip === '::1' || ip === '127.0.0.1' || ip.startsWith('192.168.') || ip.startsWith('10.')) {
            return {
                country: null,
                city: null
            };
        }

        const geo = geoip.lookup(ip);

        if (!geo) {
            return {
                country: null,
                city: null
            };
        }

        return {
            country: geo.country || null,
            city: geo.city || null
        };
    } catch (error) {
        console.error('GeoIP lookup error:', error);
        return {
            country: null,
            city: null
        };
    }
};

module.exports = {
    getLocationFromIP
};
