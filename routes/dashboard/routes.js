const express = require('express');
const router = express.Router();
const { upload } = require('../../middleware/multerFile')
const multer = require('multer');
const uploads = multer({
    storage: multer.memoryStorage(),
    limits: {
        files: 3, // Maximum number of files allowed (1 to 3)
    },
});
const gameListController = require('../../controller/dashboard/gameList')
const playerListController = require('../../controller/dashboard/playerList')
const contestListController = require('../../controller/dashboard/contest')
const bannerController = require('../../controller/dashboard/banner')
const userController = require('../../controller/dashboard/users')
const videoController = require('../../controller/dashboard/videoList')

router.post('/createGame', upload.single('fileName'), gameListController.createGame)
router.get('/getGames', gameListController.getGames)
router.get('/editGames',gameListController.editGames)

router.post('/createPlayer', upload.single('fileName'), playerListController.createPlayer)
router.get('/getPlayerAll', playerListController.getPlayerAll)

// createContest
router.post('/createContest', upload.array('fileName'), contestListController.createContest)
router.get('/getContest', contestListController.getContest)

router.post('/createBanner', upload.single('fileName'), bannerController.createBanner)   
router.get('/getBanner', bannerController.getBanner)

router.get('/getUsers',userController.getUsers)

router.post('/getBannerStatus',bannerController.getBannerStatus)

router.post('/storeVideo',uploads.array('files', 2),videoController.storeVideo)
router.get('/getVideo',videoController.getVideo)


module.exports = router;