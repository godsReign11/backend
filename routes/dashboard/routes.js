const express = require('express');
const router = express.Router();

const gameListController =require('../../controller/dashboard/gameList')

router.post('/createGame',gameListController.createGame)
router.get('/getGames',gameListController.getGames)

module.exports = router ;