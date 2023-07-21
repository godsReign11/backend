const banner = require('../../models/dashboard/banner')

var createBanner =async function(req,res)
{
const {videoUrl,title,description} = req.body;
await banner.create({videoUrl,title,description,bannerUrl:req.file.path})
res.send({
    status:true,
    message:"created successfully"
})
}

const getBanner =async function(req,res)
{
    var data =await banner.find();
    return res.send({
        status:true,
        data:data,
        message:"Success"
    })
}


module.exports={createBanner,getBanner}