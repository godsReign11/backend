const mongoose = require('mongoose');

const schema = mongoose.Schema;

const contestListSchema = new schema({
    contestGame: {
        type: String
    },
    teamAurl: {
        type: String
    },
    teamAname:{
        type: String
    },
    teamBname:{
        type:String
    },
    teamBurl:{
        type:String
    },
    teamAscore:{
        type:Number
    },
    teamBscore:{
        type:Number
    },
    startDate:{
        type:String
    },
    title:{
        type:String
    },
    contestUrl:{
        type:String
    },
    description:{
        type:String
    },
    subtitle:{
        type:String
    }
}, { timestamps: true })

const contestList = mongoose.model('contestList', contestListSchema);

module.exports = contestList;


