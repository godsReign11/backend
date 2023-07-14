
const express = require('express');
const router = express.Router();

const userController = require('../../controller/app/userController');

router.post('/userRegister', userController.userRegister);
router.post('/passwordLogin', userController.passwordLogin);
router.post('/sentOtp', userController.sentOtp);
router.post('/verifyOtp', userController.verifyOtp);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);

module.exports = router;