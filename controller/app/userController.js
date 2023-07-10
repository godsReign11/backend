const user = require('../../models/app/userModel');

const userRegister = async (req, res) => {
    const { phone, email, password, cPassword } = req.body;
    // if (!phone || !email) {
    //     return res.send({
    //         message: "Please provide either phone or email!",
    //         status: false
    //     })
    // }
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
    // const userData = await user.findOne({ $or: [{ phone }, { email }] });
    // if (userData) {
    //     return res.send({
    //         message: `This ${phone || email} is already registered`,
    //         status: false
    //     })
    // }
    await user.create({ phone, email, password });
    res.send({
        message: "User registered Successfully!",
        status: true
    })
};

module.exports = {
    userRegister
}