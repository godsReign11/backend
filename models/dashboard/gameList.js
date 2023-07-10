const mongoose = require('mongoose');

const schema = mongoose.Schema;

const gameListSchema = new schema({
    gameUrl: {
        type: String
    },
    name: {
        type: String
    },
    order:{
        type:Number
    }
}, { timestamps: true })

const gameList = mongoose.model('gameList', gameListSchema);

module.exports = gameList;
