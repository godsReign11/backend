const mongoose = require('mongoose');

const schema = mongoose.Schema;

const bannerListSchema = new schema({    
    bannerUrl:{
        type:String
    },
    videoUrl:{
        type:String
    },
    title:{
        type:String
    },
    description:{
        type:String
    },
    subtitle:{
        type:String
    },
    isActive:{
        type:Boolean,
        default:true
    }
}, { timestamps: true })

const bannerList = mongoose.model('bannerList', bannerListSchema);

module.exports = bannerList;


