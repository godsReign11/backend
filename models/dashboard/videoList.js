const mongoose = require('mongoose');

const schema = mongoose.Schema;
const videoListSchema = new schema({
    category: {
        type: String,
        required:true
    },
    title: {
        type: String,
        required:true
    },
    subTitle:{
        type:String
    },
    descripion:{
        type:String
    },
    videoUrl:{
        type:String,
        required:true
    },
    thumbnail:{
        type:String
    },
    isKid:{
        type:Boolean,
        default:false
    },
    isAgeRestrict:{
        type:Boolean,
        default:false
    },
    views:{
        type:Number,
        default:0
    },
    userId:{
        type:String
    },
    userFollower:{
        type:Number,
        default:0
    },
    likesCount:{
        type:String,
        default:0
    },
    commentsCount:{
        type:String,
        default:0
    },
    isDraft:{
        type:Boolean,
        default:false
    },
    isDeleted:{
        type:String,
        default:false
    },
    isVideo:{
        type:Boolean,
    }
}, { timestamps: true })

const playerList = mongoose.model('videoList', videoListSchema);

module.exports = playerList;
