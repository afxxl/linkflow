const mongoose = require('mongoose');

const clickSchema = new mongoose.Schema({
    linkId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Link',
        required: true,
        index: true
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    timestamp: {
        type: Date,
        default: Date.now,
        index: true
    },
    ipAddress: {
        type: String,
        default: null
    },
    country: {
        type: String,
        default: null
    },
    city: {
        type: String,
        default: null
    },
    device: {
        type: String,
        enum: ['mobile', 'desktop', 'tablet', 'unknown'],
        default: 'unknown'
    },
    browser: {
        type: String,
        default: null
    },
    os: {
        type: String,
        default: null
    },
    referrer: {
        type: String,
        default: null
    },
    userAgent: {
        type: String,
        default: null
    },
    rotatedUrl: {
        type: String,
        default: null
    }
});

// Compound indexes for analytics queries
clickSchema.index({ userId: 1, timestamp: -1 });
clickSchema.index({ linkId: 1, timestamp: -1 });
clickSchema.index({ userId: 1, country: 1 });
clickSchema.index({ userId: 1, device: 1 });

module.exports = mongoose.model('Click', clickSchema);
