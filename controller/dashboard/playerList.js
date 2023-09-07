const playerList =require('../../models/dashboard/playerList')
const AWS =require("aws-sdk");
const s3 = new AWS.S3({
    accessKeyId:"AKIAYQQR444W53XDGLNN" ,
    secretAccessKey:"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",
});

const createPlayer =async function(req,res)
{
    const {playerName,
        playerShortName,
        gameCategory,
        order}=req.body;
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
            await playerList.create({playerName,
                playerShortName,
                gameCategory,
                playerImage:data.Location,
               order: parseInt(order)});  
        });
    res.send({
        status:true,
        message:"player stored"
    })
}

const getPlayerAll =async function(req,res)
{
    var data =await playerList.find().lean();
    if(data==null)
    {
        return res.send({
            status:false,
            data:[],
            message:"No data found"
        })
    }
    res.send({
        status:true,
        data:data,
        message:"data fetched"
    })
}

module.exports={createPlayer,getPlayerAll}