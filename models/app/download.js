const mongoose = require('mongoose');

const schema = mongoose.Schema;

const downloadSchema = new schema({
    videoId: {
        type: String,
        default: ""
    },
    userId: {
        type: String,
        required:true
    },
    path: {
        type: String,
        required:true
    },
    thumbnail: {
        type: String,
        default: ""
    },
    title:{
        type:String
    },
    isDeleted:{
        type:Boolean,
        default:false
    }

}, { timestamps: true })

const download = mongoose.model('download', downloadSchema);

module.exports = download;
