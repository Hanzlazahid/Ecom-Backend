const Cat=require('../model/ProductCategoryModel')
const asyncHandler=require('express-async-handler')
const validateMongoId=require('../utils/validateMongodbid')

createCat=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.create(req.body)
        res.json(category)
    }catch(err){
        throw new Error(err)
    }
})
updateCat=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.json(category)
    }catch(err){
        throw new Error(err)
    }
})
deleteCat=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.findByIdAndDelete(req.params.id)
        res.json("Category deleted successfully")
    }catch(err){
        throw new Error(err)
    }
})
getAllCat=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.find()
        res.json(category)
    }catch(err){
        throw new Error(err)
    }
})
getCat=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.findById(req.params.id)
        res.json(category)
    }catch(err){
        throw new Error(err)
    }
})

module.exports={createCat,getCat,getAllCat,deleteCat,updateCat}