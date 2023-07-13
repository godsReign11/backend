const user = require('../../models/app/userModel');
const appotp = require('../../models/app/appotp');

const userRegister = async (req, res) => {
    const { registerKey, password, cPassword } = req.body;
    if (!registerKey) {
        return res.send({
            message: "Please provide a key to register with!",
            status: false
        })
    }
    if (!password && !cPassword) {
        return res.send({
            message: "Please provide both password or confirm password!",
            status: false
        })
    }
    if (password !== cPassword) {
        return res.send({
            message: "Please provide password and confirm password same!",
            status: false
        })
    }
    const userKey = registerKey.includes('@') || registerKey.includes('.');
    if (userKey) {
        email = registerKey;
        if (email.length > parseInt(process.env.REGISTER_EMAIL_LENGTH)) {
            return res.send({
                message: "Email must be less than 50 characters!",
                status: false
            })
        }
        const findwithEmail = await user.findOne({ email });
        if (findwithEmail) {
            return res.send({
                message: "This email is already in use!",
                status: false
            })
        }
        await user.create({ email, password });
    } else {
        phone = registerKey;
        if (phone.length !== parseInt(process.env.REGISTER_PHONE_LENGTH)) {
            return res.send({
                message: "Error in number!",
                status: false
            })
        }
        const findwithPhone = await user.findOne({ phone });
        if (findwithPhone) {
            return res.send({
                message: "This number is already in use!",
                status: false
            })
        }
        await user.create({ phone, password });
    }
    res.send({
        message: "User registered Successfully!",
        status: true
    })
};

const passwordLogin = async (req, res) => {
    const { loginKey, password } = req.body;
    if (!loginKey) {
        return res.send({
            message: "Please provide a key to login with!",
            status: false
        })
    }
    if (!password) {
        return res.send({
            message: "Please provide password to login!",
            status: false
        })
    }
    const userKey = loginKey.includes('@') || loginKey.includes('.');
    if (userKey) {
        email = loginKey;
        if (email.length > parseInt(process.env.REGISTER_EMAIL_LENGTH)) {
            return res.send({
                message: "Email must be less than 50 characters!",
                status: false
            })
        }
        const findwithEmail = await user.findOne({ email });
        if (!findwithEmail) {
            return res.send({
                message: "This email doesn't exist!",
                status: false
            })
        }
        if (findwithEmail.password !== password) {
            return res.send({
                message: "Password doesn't match!",
                status: false
            })
        }
    } else {
        phone = loginKey;
        if (phone.length !== parseInt(process.env.REGISTER_PHONE_LENGTH)) {
            return res.send({
                message: "Error in number!",
                status: false
            })
        }
        const findwithPhone = await user.findOne({ phone });
        if (!findwithPhone) {
            return res.send({
                message: "This number doesn't exist!",
                status: false
            })
        }
        if (findwithPhone.password !== password) {
            return res.send({
                message: "Password doesn't match!",
                status: false
            })
        }
    }
    res.send({
        message: "User login Approved!",
        status: true
    })
}

const otpLogin = async (req, res) => {
    const { loginKey } = req.body;
    if (!loginKey) {
        return res.send({
            message: "Please provide a key to login with!",
            status: false
        })
    }
    const OTP = Math.floor(Math.random() * 9000) + 1000;
    const userKey = loginKey.includes('@') || loginKey.includes('.');
    if (userKey) {
        email = loginKey;
        if (email.length > parseInt(process.env.REGISTER_EMAIL_LENGTH)) {
            return res.send({
                message: "Email must be less than 50 characters!",
                status: false
            })
        }
        const findwithEmail = await user.findOne({ email });
        if (!findwithEmail) {
            return res.send({
                message: "This email doesn't exist!",
                status: false
            })
        }
        await appotp.updateOne({ email, description: "Email Register OTP!" }, { otp: OTP }, { upsert: true });
        res.send({
            message: `OTP sent to your email, Please check - ${OTP}!`,
            status: true
        })
    } else {
        phone = loginKey;
        if (phone.length !== parseInt(process.env.REGISTER_PHONE_LENGTH)) {
            return res.send({
                message: "Error in number!",
                status: false
            })
        }
        const findwithPhone = await user.findOne({ phone });
        if (!findwithPhone) {
            return res.send({
                message: "This number doesn't exist!",
                status: false
            })
        }
        await appotp.updateOne({ phone, description: "Phone Register OTP!" }, { otp: OTP }, { upsert: true });
        res.send({
            message: `OTP sent to your phone, Please check - ${OTP}!`,
            status: true
        })
    }
}

const verifyOtp = async (req, res) => {
    const { loginKey, otp } = req.body;
    if (!loginKey) {
        return res.send({
            message: "Please provide a key to login with!",
            status: false
        })
    }
    if (!otp) {
        return res.send({
            message: "Please provide otp to login!",
            status: false
        })
    }
    const userKey = loginKey.includes('@') || loginKey.includes('.');
    if (userKey) {
        email = loginKey;
        if (email.length > parseInt(process.env.REGISTER_EMAIL_LENGTH)) {
            return res.send({
                message: "Email must be less than 50 characters!",
                status: false
            })
        }
        const findwithEmail = await user.findOne({ email });
        if (!findwithEmail) {
            return res.send({
                message: "This email doesn't exist!",
                status: false
            })
        }
        const emailOtp = await appotp.findOne({ email, description: "Email Register OTP!" });
        console.log("emailOtp: ", emailOtp);
        if (!emailOtp) {
            return res.send({
                message: "Invalid OTP!",
                status: false
            })
        }

        if (emailOtp.otp !== otp) {
            return res.send({
                message: "Incorrect OTP!",
                status: false
            })
        }
    } else {
        phone = loginKey;
        if (phone.length !== parseInt(process.env.REGISTER_PHONE_LENGTH)) {
            return res.send({
                message: "Error in number!",
                status: false
            })
        }
        const findwithPhone = await user.findOne({ phone });
        if (!findwithPhone) {
            return res.send({
                message: "This number doesn't exist!",
                status: false
            })
        }
        const phoneOtp = await appotp.findOne({ phone, description: "Phone Register OTP!" });
        console.log("phoneOtp: ", phoneOtp);
        if (!phoneOtp) {
            return res.send({
                message: "Invalid OTP!",
                status: false
            })
        }

        if (phoneOtp.otp !== otp) {
            return res.send({
                message: "Incorrect OTP!",
                status: false
            })
        }
    }
    res.send({
        message: "User login Approved!",
        status: true
    })
}

module.exports = {
    userRegister, passwordLogin, otpLogin, verifyOtp
}