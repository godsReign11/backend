const mongoose = require('mongoose');

const schema = mongoose.Schema;

const userSchema = new schema({
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

}, { timestamps: true })

const users = mongoose.model('user', userSchema);

module.exports = users;
