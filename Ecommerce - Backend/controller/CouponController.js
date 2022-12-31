const Coupon=require('../model/CouponModel')
const asyncHandler=require('express-async-handler')

createCoupon=asyncHandler(async(req,res)=>{
    try{
        const coupon=await Coupon.create(req.body)
        res.json(coupon)
    }catch(err){
        throw new Error(err)
    }
})

updateCoupon=asyncHandler(async(req,res)=>{
    try{
        const coupon=await Coupon.findByIdAndUpdate(req.params.id,req.body,{new:true})
        res.json(coupon)
    }catch(err){
        throw new Error(err)
    }
})

deleteCoupon=asyncHandler(async(req,res)=>{
    try{
        const coupon=await Coupon.findByIdAndDelete(req.params.id)
        res.json("Coupon Deleted Successfully")
    }catch(err){
        throw new Error(err)
    }
})

getCoupon=asyncHandler(async(req,res)=>{
    try{
        const coupon=await Coupon.findById(req.params.id)
        res.json(coupon)
    }catch(err){
        throw new Error(err)
    }
})

getAllCoupon=asyncHandler(async(req,res)=>{
    try{
        const coupon=await Coupon.find()
        res.json(coupon)
    }catch(err){
        throw new Error(err)
    }
})

module.exports={getAllCoupon,getCoupon,deleteCoupon,updateCoupon,createCoupon}