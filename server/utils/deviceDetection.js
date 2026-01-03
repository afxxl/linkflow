const UAParser = require('ua-parser-js');

/**
 * Parse user agent string to extract device, browser, and OS information
 * @param {string} userAgent - User agent string
 * @returns {object} - Parsed device information
 */
const parseUserAgent = (userAgent) => {
    try {
        if (!userAgent) {
            return {
                device: 'unknown',
                browser: null,
                os: null
            };
        }

        const parser = new UAParser(userAgent);
        const result = parser.getResult();

        // Determine device type
        let deviceType = 'desktop';
        if (result.device.type === 'mobile') {
            deviceType = 'mobile';
        } else if (result.device.type === 'tablet') {
            deviceType = 'tablet';
        } else if (result.device.type) {
            deviceType = result.device.type;
        }

        return {
            device: deviceType,
            browser: result.browser.name || null,
            os: result.os.name || null
        };
    } catch (error) {
        console.error('User agent parsing error:', error);
        return {
            device: 'unknown',
            browser: null,
            os: null
        };
    }
};

module.exports = {
    parseUserAgent
};
