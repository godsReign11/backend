const express = require('express');
const router = express.Router();

const gameListController =require('../../controller/dashboard/gameList')
const playerListController =require('../../controller/dashboard/playerList')

router.post('/createGame',gameListController.createGame)
router.get('/getGames',gameListController.getGames)

router.post('/createPlayer',playerListController.createPlayer)
router.get('/getPlayerAll',playerListController.getPlayerAll)

module.exports = router ;