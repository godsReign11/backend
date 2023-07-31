const gameList=require('../../models/dashboard/gameList')

const createGame=async function(req,res)
{
    const {name,order}=req.body;
    const params = {
        Bucket: 'gods-media', // bucket that we made earlier
        Key: req.file.originalname, // Name of the image
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
        status_code:true,
        message:"game created successfully"
    })
}

const getGames =async function(req,res)
{
    const data=await gameList.find();
    res.send({
        status_code:true,
        message:"sucess",
        data
    })
}

module.exports={
    createGame,
    getGames
}