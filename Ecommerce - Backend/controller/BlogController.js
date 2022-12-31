const Blog= require('../model/BlogModel')
const asyncHandler=require('express-async-handler')
const {validateMongodbid}=require('../utils/validateMongodbid')
const {cloudinaryUploadImg}=require('../utils/cloudinary')
const fs=require('fs')

createBlog=asyncHandler(async(req,res)=>{
    try{
        const blog=await Blog.create(req.body)
        res.json(blog)
    }catch(err){
        throw new Error(err)
    }
})

updateBlog=asyncHandler(async(req,res)=>{
    try{
        const blog=await Blog.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.json(blog)
    }catch(err){
        throw new Error(err)
    }
})

getAllBlog=asyncHandler(async(req,res)=>{
    try{
        const blog=await Blog.find()
        res.json(blog)
    }catch(err){
        throw new Error(err)
    }
})

getBlog=asyncHandler(async(req,res)=>{
    try{
        const blog=await Blog.findById(req.params.id).populate('likes').populate('dislikes')
        await Blog.findByIdAndUpdate(req.params.id,{$inc:{numViews:1}},{new:true})
        res.json(blog)
    }catch(err){
        throw new Error(err)
    }
})

deleteBlog=asyncHandler(async(req,res)=>{
    try{
        const blog=await Blog.findByIdAndDelete(req.params.id)
        res.json("Blog Deleted")
    }catch(err){
        throw new Error(err)
    }
})

likeBlog=asyncHandler(async(req,res)=>{
    try{
        const blogId=req.body.blogId
        validateMongodbid(blogId)
        // CHECK WHICH BLOG USER WANT TO LIKE
        const blog=await Blog.findById(blogId)
        // FIND THE USER WHO WANT TO LIKE
        const loginUserId=req?.user?.id
        // CHECK IF THE USER ALREADY LIKED IT
        const isliked=blog.isLiked
        const isdisliked=blog?.dislikes?.find((userId) => userId?.toString()===loginUserId?.toString())
        if(isdisliked){
            const post =await Blog.findByIdAndUpdate(blogId,{
                $pull:{dislikes:loginUserId},
                isdisliked:false
            },{new:true})
            res.json(blog)
        }
        if(isliked){
            const post =await Blog.findByIdAndUpdate(blogId,{
                $pull:{likes:loginUserId},
                isLiked:false
            },{new:true})
            res.json(blog)
        }else{
            const post =await Blog.findByIdAndUpdate(blogId,{
                $push:{likes:loginUserId},
                isLiked:true
            },{new:true})
            res.json(blog)
        }
    }catch(err){
        throw new Error(err)
    }
})

dislikeBlog=asyncHandler(async(req,res)=>{
    try{
        const blogId=req.body.blogId
        validateMongodbid(blogId)
        // CHECK WHICH BLOG USER WANT TO LIKE
        const blog=await Blog.findById(blogId)
        // FIND THE USER WHO WANT TO LIKE
        const loginUserId=req?.user?.id
        // CHECK IF THE USER ALREADY LIKED IT
        const isdisliked=blog?.isDisliked
        const isliked=blog?.likes?.find((userId) => userId?.toString()===loginUserId?.toString())
        if(isliked){
            const post =await Blog.findByIdAndUpdate(blogId,{
                $pull:{likes:loginUserId},
                isLiked:false
            },{new:true})
            res.json(blog)
        }
        if(isdisliked){
            const post =await Blog.findByIdAndUpdate(blogId,{
                $pull:{dislikes:loginUserId},
                isDisliked:false
            },{new:true})
            res.json(blog)
        }else{
            const post =await Blog.findByIdAndUpdate(blogId,{
                $push:{dislikes:loginUserId},
                isDisliked:true
            },{new:true})
            res.json(blog)
        }
    }catch(err){
        throw new Error(err)
    }
})

uploadImg=asyncHandler(async(req,res)=>{
    const id=req.params.id
    try{
     const uploader=(path)=>cloudinaryUploadImg(path,"images")
     const urls=[]
     const files=req.files
     for(const file of files){
         const {path}=file
         const newPath=await uploader(path)
         console.log(newPath);
         urls.push(newPath)
        fs.unlinkSync(path)
     }
     const blog=await Blog.findByIdAndUpdate(id,{
         image:urls.map(file=>{return file})
     },{new:true})
     res.json(blog)
    }catch(err){
     throw new Error(err)
    }
 })

module.exports={createBlog,updateBlog,getAllBlog,getBlog,deleteBlog,likeBlog,dislikeBlog,uploadImg}