const gameList=require('../../models/dashboard/gameList')
const objectId = require('mongoose').objectId;
const AWS =require("aws-sdk");
const s3 = new AWS.S3({
    accessKeyId:"AKIAYQQR444W53XDGLNN" ,
    secretAccessKey:"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",
});
const createGame=async function(req,res)
{
    const {name,order}=req.body;
    const params = {
        Bucket: 'gods-media', // bucket that we made earlier
        Key: name, // Name of the image
        Body: req.file.buffer, // Body which will contain the image in buffer format
    };
    s3.upload(params, async (error, data) => {
        console.log(data)
        if (error) {
           return res.send({
            status:false,
            message:"something went wrong"
           }); // if we get any error while uploading error message will be returned.
        }
        console.log(data.Location,name,parseInt(order))
           await gameList.create({gameUrl:data.Location,name,order:parseInt(order)})
    });
    
    res.send({
        status:true,
        message:"game created successfully"
    })
}

const getGames =async function(req,res)
{
    const data=await gameList.find({isActive:true});
    res.send({
        status:true,
        message:"sucess",
        data
    })
}

const editGames = async function(req,res)
{
    const {userId,name,order} = req.body;
    await gameList.updateOne({userId:objectId(userId)},{$set:{name:name,order:order}})
    res.send({
        status:true,
        message:"success"
    })
}

module.exports={
    createGame,
    getGames,
    editGames
}