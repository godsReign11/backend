const banner = require('../../models/dashboard/banner')
const downloads = require('../../models/app/download')
const AWS =require("aws-sdk");
const {generateOTP} = require('../../services/otp');
const watchlist = require('../../models/app/watchlist');
const objectId = require('mongoose').Types.ObjectId
const s3 = new AWS.S3({
    accessKeyId:"AKIAYQQR444W53XDGLNN" ,
    secretAccessKey:"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",
});

var createBanner =async function(req,res)
{
const {videoUrl,videoTitle,videoDescription,title,description,shortDescription,audio,subtitle} = req.body;
const params = {
    Bucket: 'gods-media', // bucket that we made earlier
    Key: req.file.originalname, // Name of the image
    Body: req.file.buffer, // Body which will contain the image in buffer format
};
console.log(params)
s3.upload(params, async (error, data) => {
    if (error) {
       return res.send({
        status:false,
        message:"something went wrong"
       }); // if we get any error while uploading error message will be returned.
    }
    let videoId = generateOTP()+generateOTP();
    await banner.create({videoTitle,videoId,videoDescription,videoUrl,title,shortDescription,audio,subtitle,description,bannerUrl:data.Location})
});
res.send({
    status:true,
    message:"created successfully"
})
}

const getBanner =async function(req,res)     //provide user_id too
{
    const {userId} = req.query;
    var data =await banner.find({isActive:true});
    return res.send({
        status:true,
        data:data,
        message:"Success"
    })
}

const getBannerStatus = async function(req,res)
{
    const {userId,videoId}=req.body;
    let match ={userId:new objectId(userId),videoId:videoId}
    var isDownload = await downloads.count(match);
    var isWatchlist = await watchlist.count(match);

    res.send({
        status:true,
        message:"Success",
        isDownload,
        isWatchlist
    })


}


module.exports={getBannerStatus,createBanner,getBanner}