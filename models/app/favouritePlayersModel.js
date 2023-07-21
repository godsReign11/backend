const mongoose = require('mongoose');

const schema = mongoose.Schema;

const favouritePlayersSchema = new schema({
    userId:{
        type:String,
        default:""
    },
    favGamesId: {
        type: Array,
        default: []
    },
    favPlayersId: {
        type: Array,
        default: []
    }

}, { timestamps: true })

const favouritePlayers = mongoose.model('favouriteplayer', favouritePlayersSchema);

module.exports = favouritePlayers;
