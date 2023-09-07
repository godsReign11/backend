const videoList = require('../../models/dashboard/videoList')
const { S3Client, PutObjectCommand } = require('@aws-sdk/client-s3');
const AWS =require("aws-sdk");
const s3 = new AWS.S3({
    accessKeyId:"AKIAYQQR444W53XDGLNN" ,
    secretAccessKey:"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",
});
const uploadToS3 =async function(file)
{
    const s3Client = new S3Client({
        region: 'us-east-1',
        credentials: {
            accessKeyId: "AKIAYQQR444W53XDGLNN",
            secretAccessKey: "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",
        },
    });

    const fileName = file.originalname;
    const bucketName = 'gods-media';

    const params = {
        Bucket: bucketName,
        Key:  fileName,
        Body: file.buffer,
        // ACL: 'public-read', // Set the ACL to public-read if you want the uploaded files to be publicly accessible
    };
    // Upload the file to S3
    const command = new PutObjectCommand(params);
    const response = await s3Client.send(command);
    // Get the uploaded file URL
    const fileURL = `https://${bucketName}.s3.amazonaws.com/${fileName}`;
    return fileURL;
}

const storeVideo = async function(req,res)
{
 let {category,title,subTitle,description,isKid,isAgeRestrict,isDraft,userId}=req.body;
    const files= req.files;
    var location=[];
    console.log(files)
    for(let i =0;i<files.length;i++)
    {
    var getData = await uploadToS3(files[i])
    location.push(getData)
}
    await videoList.create({category,title,subTitle,description,
        videoUrl:location[0],isDraft,thumbnail:location[1],isKid,isAgeRestrict})
res.send({
    status:true,
    message:"video Saved"
})
}

const getVideo = async function(req,res)
{
    var data = await videoList.find({isDeleted:false});
    res.send({
        status:true,
        message:"Success",
        data
    })
}
 
module.exports={storeVideo,getVideo}

