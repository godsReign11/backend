const playerList =require('../../models/dashboard/playerList')

const createPlayer =async function(req,res)
{
    const {playerName,
        playerShortName,
        gameCategory,
        playerImage,
        order}=req.body;
    await playerList.create({playerName,
        playerShortName,
        gameCategory,
        playerImage,
       order: parseInt(order)});

    res.send({
        status:true,
        data:[],
        message:"player stored"
    })
}

const getPlayerAll =async function(req,res)
{
    var data =await playerList.find();
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