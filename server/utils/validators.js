/**
 * Validate URL format
 * @param {string} url - URL to validate
 * @returns {boolean} - True if valid
 */
const isValidUrl = (url) => {
    try {
        new URL(url);
        return /^https?:\/\/.+/.test(url);
    } catch (error) {
        return false;
    }
};

/**
 * Validate username format
 * @param {string} username - Username to validate
 * @returns {boolean} - True if valid
 */
const isValidUsername = (username) => {
    return /^[a-z0-9_-]{3,20}$/.test(username);
};

/**
 * Validate email format
 * @param {string} email - Email to validate
 * @returns {boolean} - True if valid
 */
const isValidEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email);
};

/**
 * Check if date is in the future
 * @param {Date} date - Date to check
 * @returns {boolean} - True if in future
 */
const isFutureDate = (date) => {
    return new Date(date) > new Date();
};

/**
 * Check if current time is within schedule
 * @param {Date} startDate - Schedule start date
 * @param {Date} endDate - Schedule end date
 * @returns {boolean} - True if within schedule
 */
const isWithinSchedule = (startDate, endDate) => {
    const now = new Date();
    const start = new Date(startDate);
    const end = new Date(endDate);

    return now >= start && now <= end;
};

module.exports = {
    isValidUrl,
    isValidUsername,
    isValidEmail,
    isFutureDate,
    isWithinSchedule
};
