const Cat=require('../model/BlogCatModel')
const asyncHandler=require('express-async-handler')
const validateMongoId=require('../utils/validateMongodbid')

createBlog=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.create(req.body)
        res.json(category)
    }catch(err){
        throw new Error(err)
    }
})
updateBlog=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.json(category)
    }catch(err){
        throw new Error(err)
    }
})
deleteBlog=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.findByIdAndDelete(req.params.id)
        res.json("Category deleted successfully")
    }catch(err){
        throw new Error(err)
    }
})
getAllBlog=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.find()
        res.json(category)
    }catch(err){
        throw new Error(err)
    }
})
getBlog=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.findById(req.params.id)
        res.json(category)
    }catch(err){
        throw new Error(err)
    }
})

module.exports={createBlog,getBlog,getAllBlog,deleteBlog,updateBlog}