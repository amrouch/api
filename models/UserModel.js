const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({

    username: {
        type: String,
        required: true,
        unique: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    },
    resetToken: {
        type: String,
    },
    resetTokenExpiration: {
        type: Date
    },
},
    { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;