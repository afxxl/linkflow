const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
    username: {
        type: String,
        required: [true, 'Username is required'],
        unique: true,
        lowercase: true,
        trim: true,
        minlength: [3, 'Username must be at least 3 characters'],
        maxlength: [20, 'Username must not exceed 20 characters'],
        match: [/^[a-z0-9_-]+$/, 'Username can only contain lowercase letters, numbers, hyphens, and underscores']
    },
    email: {
        type: String,
        required: [true, 'Email is required'],
        unique: true,
        lowercase: true,
        trim: true,
        match: [/^\S+@\S+\.\S+$/, 'Please provide a valid email address']
    },
    password: {
        type: String,
        required: [true, 'Password is required'],
        minlength: [6, 'Password must be at least 6 characters']
    },
    plan: {
        type: String,
        enum: ['free', 'creator', 'pro'],
        default: 'free'
    },
    customDomain: {
        type: String,
        default: null
    },
    theme: {
        backgroundColor: {
            type: String,
            default: '#ffffff'
        },
        buttonColor: {
            type: String,
            default: '#3b82f6'
        },
        textColor: {
            type: String,
            default: '#1f2937'
        },
        buttonTextColor: {
            type: String,
            default: '#ffffff'
        },
        fontFamily: {
            type: String,
            default: 'Inter'
        },
        style: {
            type: String,
            enum: ['default', 'dark', 'colorful'],
            default: 'default'
        }
    }
}, {
    timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function (next) {
    if (!this.isModified('password')) {
        return next();
    }

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to compare password
userSchema.methods.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);
