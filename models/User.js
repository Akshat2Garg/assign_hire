const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    status: {
        type: String,
        enum: ['AVAILABLE', 'BUSY'],
        default: 'AVAILABLE',
    },
});

module.exports = mongoose.model('User', UserSchema);
