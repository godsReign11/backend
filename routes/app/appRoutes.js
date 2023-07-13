
const express = require('express');
const router = express.Router();

const userController = require('../../controller/app/userController');

router.post('/userRegister', userController.userRegister);
router.post('/passwordLogin', userController.passwordLogin);

module.exports = router;