const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
    userName: {
        type: String,
        unique: true,
        required: true
    },
    name: {
        type: String,
        default: ""
    },
    email: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    password: {
        type: String
    },
    gender: {
        type: String,
        default: ""
    },
    profileImage: {
        type: String,
        default: ""
    },
    isActive: {
        type: Boolean,
        default: false
    },
    isBlock: {
        type: Boolean,
        default: false
    },
    isDeleted: {
        type: Boolean,
        default: false
    },

}, { timestamps: true })

const users = mongoose.model('user', userSchema);

module.exports = users;
