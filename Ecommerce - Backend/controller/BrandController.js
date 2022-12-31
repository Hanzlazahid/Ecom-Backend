const Cat=require('../model/BrandModel')
const asyncHandler=require('express-async-handler')
const validateMongoId=require('../utils/validateMongodbid')

createBrand=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.create(req.body)
        res.json(category)
    }catch(err){
        throw new Error(err)
    }
})
updateBrand=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.json(category)
    }catch(err){
        throw new Error(err)
    }
})
deleteBrand=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.findByIdAndDelete(req.params.id)
        res.json("Brand deleted successfully")
    }catch(err){
        throw new Error(err)
    }
})
getAllBrand=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.find()
        res.json(category)
    }catch(err){
        throw new Error(err)
    }
})
getBrand=asyncHandler(async(req,res)=>{
    try{
        const category=await Cat.findById(req.params.id)
        res.json(category)
    }catch(err){
        throw new Error(err)
    }
})

module.exports={createBrand,getBrand,getAllBrand,deleteBrand,updateBrand}