
const express = require('express');
const router = express.Router();
const { upload } = require('../../middleware/multerFile')

const userController = require('../../controller/app/userController');
const userActivityController = require('../../controller/app/userActivity')

router.post('/userRegister', upload.single('fileName'), userController.userRegister);
router.post('/passwordLogin', userController.passwordLogin);
router.post('/sentOtp', userController.sentOtp);
router.post('/verifyOtp', userController.verifyOtp);
router.post('/forgotPassword', userController.forgotPassword);
router.post('/resetPassword', userController.resetPassword);
router.post('/storeUserDownloads',userActivityController.storeUserDownloads);
router.get('/getUserDownloads',userActivityController.getUserDownloads)
router.post('/storeUserWatchlist',userActivityController.storeUserWatchlist);
router.get('/getUserwatchlist',userActivityController.getUserWatchlist)


module.exports = router;