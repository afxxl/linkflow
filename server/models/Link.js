const mongoose = require('mongoose');

const linkSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        index: true
    },
    title: {
        type: String,
        required: [true, 'Link title is required'],
        trim: true,
        maxlength: [100, 'Title must not exceed 100 characters']
    },
    url: {
        type: String,
        required: [true, 'URL is required'],
        trim: true,
        validate: {
            validator: function (v) {
                return /^https?:\/\/.+/.test(v);
            },
            message: 'Please provide a valid URL starting with http:// or https://'
        }
    },
    position: {
        type: Number,
        default: 0
    },
    isActive: {
        type: Boolean,
        default: true
    },
    icon: {
        type: String,
        default: null
    },

    // Automation Features
    schedule: {
        enabled: {
            type: Boolean,
            default: false
        },
        startDate: {
            type: Date,
            default: null
        },
        endDate: {
            type: Date,
            default: null
        },
        timezone: {
            type: String,
            default: 'UTC'
        }
    },

    geoTargeting: {
        enabled: {
            type: Boolean,
            default: false
        },
        countries: [{
            type: String,
            uppercase: true
        }],
        action: {
            type: String,
            enum: ['show', 'hide'],
            default: 'show'
        }
    },

    deviceTargeting: {
        enabled: {
            type: Boolean,
            default: false
        },
        devices: [{
            type: String,
            enum: ['mobile', 'desktop', 'tablet']
        }]
    },

    rotation: {
        enabled: {
            type: Boolean,
            default: false
        },
        urls: [{
            type: String,
            validate: {
                validator: function (v) {
                    // Skip validation for empty strings
                    if (!v || v.trim() === '') return true;
                    return /^https?:\/\/.+/.test(v);
                },
                message: 'Each rotation URL must be valid and start with http:// or https://'
            }
        }],
        method: {
            type: String,
            enum: ['random', 'sequential'],
            default: 'random'
        },
        currentIndex: {
            type: Number,
            default: 0
        }
    },

    clickCount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Index for efficient querying
linkSchema.index({ userId: 1, position: 1 });
linkSchema.index({ userId: 1, isActive: 1 });

module.exports = mongoose.model('Link', linkSchema);
