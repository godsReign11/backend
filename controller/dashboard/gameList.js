const gameList=require('../../models/dashboard/gameList')

const createGame=async function(req,res)
{
    const {name,order}=req.body;
    await gameList.create({gameUrl:req.file.path,name,order})
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