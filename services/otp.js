const axios = require('axios');
const msg91AuthKey = "401846AEjwSihvV64e4ed4dP1";
async function generateOTP() {
    // Generate a random 6-digit number
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    return otp;
}

const msg91Template = async (type) => {
    if (type === "register") {
        return "64c258efd6fc053afd431731"
    } else if (type === "login") {
        return "64c258bed6fc0509641d2913"
    } else if (type === "forgot") {
        return "64c25917d6fc05113970ac92"
    }
}

const sendOtp = async (key, type) => {
    // const userKey = key.includes('@') || key.includes('.');
    // if(userKey){
    //     return 
    // }else{
    //     return phone;
    // }

    const otp = await generateOTP();
    const templateId = await msg91Template(type);
    const url = `https://api.msg91.com/api/v5/otp?authkey=${msg91AuthKey}&template_id=${templateId}&mobile=91${key}&otp=${otp}`;
    const otpResponse = await axios.get(url);
    return { otpRes:otpResponse.data, otp }
}

module.exports = {
    sendOtp
}