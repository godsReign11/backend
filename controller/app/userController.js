const AWS = require("aws-sdk");


const user = require('../../models/app/userModel');
const appotp = require('../../models/app/appotpModel');
const favouriteplayer = require('../../models/app/favouritePlayersModel');

const s3 = new AWS.S3({
    accessKeyId: "AKIAYQQR444W53XDGLNN",
    secretAccessKey: "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",
})

const userRegister = async (req, res) => {
    const { userName, registerKey, password, cPassword, favGamesId, favPlayersId } = req.body;
    if (!userName) {
        return res.send({
            message: "Please provide userName!",
            status: false
        })
    }
    const findUserName = await user.findOne({ userName: userName.replaceAll(" ", "") });
    if (findUserName) {
        return res.send({
            message: "This username already in use!",
            status: false
        })
    }
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
    let userId;
    const uploadParams = {
        Bucket: 'gods-media',
        Key: `userProfileImages/${userName.replaceAll(" ", "")}.png`,
        Body: req.file.buffer,
    };
    const uploadedImage = await s3.upload(uploadParams).promise();
    if (userKey) {
        email = registerKey;
        if (email.length > parseInt(process.env.REGISTER_EMAIL_LENGTH)) {
            return res.send({
                message: "Email must be less than 50 characters!",
                status: false
            })
        }
        const findwithEmail = await user.findOne({ email, isActive: true });
        if (findwithEmail) {
            return res.send({
                message: "This email is already in use!",
                status: false
            })
        }
        const userCreate = await user.create({ userName: userName.replaceAll(" ", ""), email, password, profileImage: uploadedImage.Location || "" });
        userId = userCreate?._id;
    } else {
        phone = registerKey;
        if (phone.length !== parseInt(process.env.REGISTER_PHONE_LENGTH)) {
            return res.send({
                message: "Error in number!",
                status: false
            })
        }
        const findwithPhone = await user.findOne({ phone, isActive: true });
        if (findwithPhone) {
            return res.send({
                message: "This number is already in use!",
                status: false
            })
        }
        const userCreate = await user.create({ userName: userName.replaceAll(" ", ""), phone, password, profileImage: uploadedImage.Location || "" });
        userId = userCreate?._id;
    }
    await favouriteplayer.create({ userId, favGamesId, favPlayersId })
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

const sentOtp = async (req, res) => {
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
    const { loginKey, otp, verifyType } = req.body;
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
        if (verifyType === "register") {
            await user.findOneAndUpdate({ email }, { $set: { isActive: true } });
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
        if (verifyType === "register") {
            await user.findOneAndUpdate({ phone }, { $set: { isActive: true } });
        }
    }
    res.send({
        message: "User OTP Verified!",
        status: true
    })
}

const forgotPassword = async (req, res) => {
    const { verifyKey, newPassword, cPassword } = req.body;
    if (!verifyKey) {
        return res.send({
            message: "Please provide a key for forgot password!",
            status: false
        })
    }
    if (!newPassword || !cPassword) {
        return res.send({
            message: "Please provide both password!",
            status: false,
        })
    }
    if (newPassword !== cPassword) {
        return res.send({
            message: "Please provide password and confirm password same!",
            status: false
        })
    }
    const userKey = verifyKey.includes('@') || verifyKey.includes('.');
    if (userKey) {
        email = verifyKey;
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
        await user.updateOne({ _id: findwithEmail._id }, { $set: { password: newPassword } });
    } else {
        phone = verifyKey;
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
        await user.updateOne({ _id: findwithPhone._id }, { $set: { password: newPassword } });
    }
    res.send({
        message: "New password updated successfully!",
        status: true
    })
}

const resetPassword = async (req, res) => {
    const { verifyKey, oldPassword, newPassword, cPassword } = req.body;
    if (!verifyKey) {
        return res.send({
            message: "Please provide a key for forgot password!",
            status: false
        })
    }
    if (!oldPassword || !newPassword || !cPassword) {
        return res.send({
            message: "Please provide old password and new password both!",
            status: false,
        })
    }
    if (newPassword !== cPassword) {
        return res.send({
            message: "Please provide password and confirm password same!",
            status: false
        })
    }
    const userKey = verifyKey.includes('@') || verifyKey.includes('.');
    if (userKey) {
        email = verifyKey;
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
        if (findwithEmail.password !== oldPassword) {
            return res.send({
                message: "Old Password doesn't match!",
                status: false
            })
        }
        await user.updateOne({ _id: findwithEmail._id }, { $set: { password: newPassword } });
    } else {
        phone = verifyKey;
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
        if (findwithPhone.password !== oldPassword) {
            return res.send({
                message: "Old Password doesn't match!",
                status: false
            })
        }
        await user.updateOne({ _id: findwithPhone._id }, { $set: { password: newPassword } });
    }
    res.send({
        message: "New password updated successfully!",
        status: true
    })
}

module.exports = {
    userRegister, passwordLogin, sentOtp, verifyOtp, forgotPassword, resetPassword
}