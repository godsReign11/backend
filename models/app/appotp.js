const mongoose = require('mongoose');

const schema = mongoose.Schema;

const otpSchema = new schema({
    email: {
        type: String,
        default: ""
    },
    phone: {
        type: String,
        default: ""
    },
    otp: {
        type: String,
        default: ""
    },
    description: {
        type: String,
        default: ""
    }

}, { timestamps: true })

const appotp = mongoose.model('appotp', otpSchema);

module.exports = appotp;
