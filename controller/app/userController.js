const AWS = require("aws-sdk");

const user = require('../../models/app/userModel');
const appotp = require('../../models/app/appotpModel');
const favouriteplayer = require('../../models/app/favouritePlayersModel');
const fetch = require('node-fetch');

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
    let uploadedImage;
    if (req.file?.buffer) {
        const uploadParams = {
            Bucket: 'gods-media',
            Key: `userProfileImages/${userName.replaceAll(" ", "")}.png`,
            Body: req.file.buffer,
        };
        uploadedImage = await s3.upload(uploadParams).promise();
    }
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
        const userCreate = await user.create({ userName: userName.replaceAll(" ", ""), email, password, profileImage: uploadedImage?.Location || "" });
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
        const userCreate = await user.create({ userName: userName.replaceAll(" ", ""), phone, password, profileImage: uploadedImage?.Location || "" });
        userId = userCreate?._id;
    }
    await favouriteplayer.create({ userId, favGamesId, favPlayersId })
    res.send({
        message: "User registered Successfully!",
        status: true,
        userId
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
    let userId;
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
        userId = findwithEmail?._id;
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
        userId = findwithPhone?._id;
    }
    res.send({
        message: "User login Approved!",
        status: true,
        userId
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
        const http = require('https');
        const options = {
            method: 'GET',
            hostname: 'api.msg91.com',
            port: null,
            path: `/api/v5/otp?template_id=64c258bed6fc0509641d2913&mobile=91${phone}&authkey=401846AEjwSihvV64e4ed4dP1&otp=${OTP}`,
            // 387507A1tInncp6421da8bP1,
            // 64536453d6fc0503793d99c3
            headers: {
                'Content-Type': 'application/JSON',
            },
        };
        const req = http.request(options, (res) => {
            const chunks = [];
            res.on('data', (chunk) => {
                chunks.push(chunk);
            });
            res.on('end', () => {
                const body = Buffer.concat(chunks);
            });
        });
        req.write('{\n  "Param1": "value1",\n  "Param2": "value2",\n  "Param3": "value3"\n}');
        req.end();
        await appotp.updateOne({ phone, description: "Phone Register OTP!" }, { otp: OTP }, { upsert: true });
        res.send({
            message: `OTP sent to your phone, Please check!`,
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

const sendOtpPhoneNumber = async (email) => {
    var otp = 123456;
    console.log("inside")
    var email = `91${email}`;
    const http = require('https');
    const options = {
        method: 'GET',
        hostname: 'api.msg91.com',
        port: null,
        path: `/api/v5/otp?template_id=64c258bed6fc0509641d2913&mobile=918130731696&authkey=401846AEjwSihvV64e4ed4dP1&otp=${otp}`,
        // 387507A1tInncp6421da8bP1,
        // 64536453d6fc0503793d99c3
        headers: {
            'Content-Type': 'application/JSON',
        },
    };
    const req = http.request(options, (res) => {
        const chunks = [];
        res.on('data', (chunk) => {
            chunks.push(chunk);
        });
        res.on('end', () => {
            const body = Buffer.concat(chunks);
            console.log(body)
        });
    });
    req.write('{\n  "Param1": "value1",\n  "Param2": "value2",\n  "Param3": "value3"\n}');
    req.end();
    return ({
        status: true,
        otp,
    });
};

const otp = async (req, res) => {
    const { p } = '7310042077';
    const ab = await sendOtpPhoneNumber(p);
    console.log(ab)
    res.send("OTP SENT.");
}



module.exports = {
    userRegister, passwordLogin, sentOtp, verifyOtp, forgotPassword, resetPassword, otp
}