const users = require('../../models/app/userModel')

var getUsers =async function(req,res)
{
    var data = await users.find();
    res.send({
        status:true,
        data:data,
        message:"success"
    })
}

module.exports={
    getUsers
}