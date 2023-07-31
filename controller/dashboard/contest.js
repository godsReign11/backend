const contestList=require('../../models/dashboard/contestList')

const createContest=async function(req,res)
{
 const {contestGame,
    contestGameId,
    teamAurl,
    teamAname,
    teamBname,
    teamAscore,
    teamBurl,
    teamBscore,
    startDate,
    title,
    contestUrl,
    description,
    subtitle} = req.body;
    await contestList.create(req.body)
    res.send({
        status:true,
        message:"game created successfully"
    })
}

const getContest =async function(req,res)
{
    const data=await contestList.find();
    res.send({
        status:true,
        message:"sucess",
        data
    })
}

module.exports={
    createContest,
    getContest
}