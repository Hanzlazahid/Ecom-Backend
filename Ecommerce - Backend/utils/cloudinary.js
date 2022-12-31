const cloudinary=require('cloudinary')

cloudinary.config({
    cloud_name:process.env.CLOUD || 'dgdjjclcr',
    api_key:process.env.APIKEY || 289155778445667,
    api_secret:process.env.APISECRET || "P4fc9oHCgK8eXUcM-jA4ijT6Yu8"
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