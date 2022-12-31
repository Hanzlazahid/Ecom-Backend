const cloudinary=require('cloudinary')

cloudinary.config({
    cloud_name:process.env.CLOUD ,
    api_key:process.env.APIKEY,
    api_secret:process.env.APISECRET
})

const cloudinaryUploadImg=async(filesToUpload)=>{
    return new Promise((resolve)=>{
        cloudinary.uploader.upload(filesToUpload,(result)=>{
            resolve({
                url: result.secure_url,
                asset_id: result.asset_id,
                public_id: result.public_id,
            },{
                resource_type:"auto",
            })
        })
    })
}

module.exports={cloudinaryUploadImg}
