const axios = require('axios');
const appotp = require('../models/app/appotpModel');
const msg91AuthKey = "401846AEjwSihvV64e4ed4dP1";

async function generateOTP(n) {
    if (typeof n !== 'number' || n <= 0) {
        throw new Error('Invalid n value. n must be a positive number.');
    }

    const min = Math.pow(10, n - 1);
    const max = Math.pow(10, n) - 1;

    return Math.floor(Math.random() * (max - min + 1)) + min;
};

const msg91Template = async (type) => {
    if (type === "register") {
        return "64c258efd6fc053afd431731"
    } else if (type === "login") {
        return "64c258bed6fc0509641d2913"
    } else if (type === "forgot") {
        return "64c25917d6fc05113970ac92"
    }
};

const sentPhoneOtp = async (key, type) => {
    const otp = await generateOTP(4);
    const templateId = await msg91Template(type);
    const url = `https://api.msg91.com/api/v5/otp?authkey=${msg91AuthKey}&template_id=${templateId}&mobile=91${key}&otp=${otp}`;
    const otpResponse = await axios.get(url);
    if (otpResponse?.data?.type === "success") {
        if (type === "register") {
            await appotp.updateOne({ phone, description: "Phone Register OTP!" }, { $set: { otp } }, { upsert: true });
            return true;
        } else if (type === "login") {
            await appotp.updateOne({ phone, description: "Phone Login OTP!" }, { $set: { otp } }, { upsert: true });
            return true;
        } else if (type === "forgot") {
            await appotp.updateOne({ phone, description: "Phone ForgotPassword OTP!" }, { $set: { otp } }, { upsert: true });
            return true;
        }
    } else {
        return false;
    }
};

const sentEmailOtp = async (key, type) => {
    return "Not active"
};

module.exports = {
    sentPhoneOtp, sentEmailOtp
}