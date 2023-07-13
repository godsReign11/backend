const mongoose = require('mongoose');

const schema = mongoose.Schema;

const playerListSchema = new schema({
    playerName: {
        type: String
    },
    playerShortName: {
        type: String
    },
    order:{
        type:Number
    },
    gameCategory:{
        type:String
    },
    playerImage:{
        type:String
    }
}, { timestamps: true })

const playerList = mongoose.model('playerList', playerListSchema);

module.exports = playerList;
