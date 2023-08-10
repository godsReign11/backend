const downloads = require('../../models/app/download')

var storeUserDownloads = async function(req,res)
{
    console.log("inn")
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
module.exports={storeUserDownloads,getUserDownloads}