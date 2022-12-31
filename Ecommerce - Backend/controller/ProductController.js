const Product = require("../model/ProductModel")
const User=require('../model/userModel.js')
const asyncHandler = require("express-async-handler")
const slugify=require('slugify')
const {cloudinaryUploadImg}=require('../utils/cloudinary')
const fs=require('fs')



CreateProduct=asyncHandler(async(req,res)=>{
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const product= await Product.create(req.body)
        res.json(product)
    }catch(err){
        throw new Error(err)
    }
})

GetAllProduct=asyncHandler(async(req,res)=>{
    try{
        // FILTERING
        const queryObj={...req.query}
        const excludedFields=["page", "sort", "limit", "fields"]
        excludedFields.forEach((el)=> delete queryObj[el])
        let queryStr=JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, (match) => `$${match}`)

        let query= Product.find(JSON.parse(queryStr))

        // SORTING
        if(req.query.sort){
            const sortBy=req.query.sort.split(",").join(" ")
            query=query.sort(sortBy)
        }else {
            query = query.sort("-createdAt")
        }

        // LIMITING
        if(req.query.fields){
            const fields=req.query.fields.split(",").join(" ")
            query=query.select(fields)
        }else{
            query = query.select("-__v")
        }

        // PAGINATION
        const page=req.query.page
        const limit=req.query.limit
        const skip= (page -1) * limit
        query=query.skip(skip).limit(limit)
        if(req.query.page){
            const productCount= await Product.countDocuments()
            if(skip >= productCount) throw new Error('This page does not exist')
        }
       
        const product=await query
        res.json(product)
    }catch(err){
        throw new Error(err)
    }
})

GetProduct=asyncHandler(async(req,res)=>{
    try{
        const product= await Product.findById(req.params.id)
        res.json(product)
    }catch(err){
        throw new Error(err)
    }
})

UpdateProduct=asyncHandler(async(req,res)=>{
    try{
        if(req.body.title){
            req.body.slug=slugify(req.body.title)
        }
        const product=await Product.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.json(product)
    }catch(err){
        throw new Error(err)
    }
})

DeleteProduct=asyncHandler(async(req,res)=>{
    try{
        const product=await Product.findByIdAndDelete(req.params.id)
        res.json("Product Deleted")
    }catch(err){
        throw new Error(err)
    }
})

addToWishList=asyncHandler(async (req,res)=>{
    const {id}=req.user
    const {productId}=req.body
    try{
        const user=await User.findById(id)
        const checkProduct=user?.wishlist.find((check)=> check.toString()===productId.toString())
        console.log(checkProduct)
        let updated;
        if(checkProduct){
            const updated=await User.findByIdAndUpdate(id,{
                $pull:{wishlist:productId}
            },{new:true})
            res.json(updated)
        }else{
            const updated= await User.findByIdAndUpdate(id,{
                $push:{wishlist:productId}
            },{new:true})
            res.json(updated)
        }
    }catch(err){
        throw new Error(err)
    }
})



rating=asyncHandler(async(req,res)=>{
    const {id}=req.user
    const {stars,prodId,comment}=req.body
    const product=await Product.findById(prodId)
    try{
        const check=product?.ratings.find((check)=> check.postedby.toString()===id.toString())
        if(check){
            const updated=await Product.updateOne(
                {ratings:{$elemMatch:check}},
                {
                   $set:{"ratings.$.star":stars,"ratings.$.comment":comment}
                },
                {new:true})
        }else{
            const updated=await Product.findByIdAndUpdate(prodId,{
                $push:{
                    ratings:{
                      star:stars,
                      comment:comment,
                      postedby:id
                    }
                }
            },{new:true})
        }
        const allratings=await Product.findById(prodId)
        let totalratings=allratings.ratings.length
        let sum=allratings.ratings.map((item)=> item.star).reduce((prev,curr)=>prev+curr,0)
        let actualrating=Math.round(sum/totalratings)
        const finaldata=await Product.findByIdAndUpdate(prodId,{totalrating:actualrating},{new:true})
        res.json(finaldata)
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
        urls.push(newPath)
        fs.unlinkSync(path)
    }
    const product=await Product.findByIdAndUpdate(id,{
        images:urls.map(file=>{return file})
    },{new:true})
    res.json(product)
   }catch(err){
    throw new Error(err)
   }
})


module.exports={CreateProduct,GetAllProduct,GetProduct,UpdateProduct,DeleteProduct,addToWishList,rating,uploadImg}