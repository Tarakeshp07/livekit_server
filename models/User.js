const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const UserSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 30
    },
    password: {
        type: String,
        required: true,
        minlength: 6
    },
    role: {
        type: String,

        default: 'student'
    },
    age: {
        type: Number,
        required: true,
        min: 0,
        max: 150
    },
    healthConditions: [{
        type: String,
        trim: true
    }],
    sleepData: {
        type: Number,
        default: 0,
        min: 0
    },
    institutionName: {
        type: String,

        trim: true,
        maxlength: 100
    },
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        lowercase: true,
        match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
    },
    sleeprate: {
        type: Number,
        default: 0,
        min: 0
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field and hash password before saving
UserSchema.pre('save', async function (next) {
    this.updatedAt = Date.now();

    if (this.isModified('password')) {
        const salt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, salt);
    }

    next();
});

// Method to compare password for login
UserSchema.methods.comparePassword = async function (candidatePassword) {
    return bcrypt.compare(candidatePassword, this.password);
};

// Create indexes for better performance
UserSchema.index({ institutionName: 1 });

module.exports = mongoose.model('User', UserSchema);
