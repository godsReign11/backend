
const express = require('express');
const router = express.Router();

const userController = require('../../controller/app/userController');

router.post('/userRegister', userController.userRegister);
router.post('/passwordLogin', userController.passwordLogin);
router.post('/otpLogin', userController.otpLogin);
router.post('/verifyOtp', userController.verifyOtp);
router.post('/forgotPassword', userController.forgotPassword);

module.exports = router;