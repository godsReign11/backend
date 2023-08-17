const downloads = require('../../models/app/download')
const watchlist = require('../../models/app/watchlist')

var storeUserDownloads = async function(req,res)
{
    const {videoId,userId,path,thumbnail,title}=req.body;
    await downloads.create({videoId,userId,path,thumbnail,title})
    return res.send({
        message: "success",
        status: true
    })
}

var getUserDownloads = async function(req,res)
{
    const getData = await downloads.find({userId:req.query.userId,isDeleted:false});
    return res.send({
        status:true,
        message:"success",
        data:getData
    })
}

const storeUserWatchlist = async function(req,res)
{
    const {videoId,userId,path,thumbnail,title}=req.body;
    await watchlist.create({videoId,userId,path,thumbnail,title})
    return res.send({
        message: "success",
        status: true
    })
}

var getUserWatchlist = async function(req,res)
{
    const getData = await watchlist.find({userId:req.query.userId,isDeleted:false});
    return res.send({
        status:true,
        message:"success",
        data:getData
    })
}
module.exports={storeUserDownloads,getUserDownloads,getUserWatchlist,storeUserWatchlist}