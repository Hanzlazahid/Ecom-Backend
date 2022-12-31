const User=require('../model/userModel.js')
const Product=require('../model/ProductModel')
const Cart=require('../model/CartModel')
const Coupon=require('../model/CouponModel')
const Order=require('../model/OrderModel')
const uniqid =require('uniqid')
const asyncHandler = require("express-async-handler");
const {genToken}=require('../config/jwtToken');
const { validateMongodbid } = require('../utils/validateMongodbid.js');
const { genRefreshToken } = require('../config/refreshToken.js');
const jwt = require('jsonwebtoken');
const { sendEmail } = require('./EmailController.js')
const crypto=require('crypto')

Register=asyncHandler(async (req,res)=>{
    const email=req.body.email
    const findUser=await User.findOne({email:email})
    if(!findUser){
     try{
        const data=await User.create(req.body)
        console.log("User Registered!")
        res.json(data)
     }catch(err){
        console.log(err)
        console.log("User Not Registered")
     }
    }else{
        throw new Error('User Already Exists')
    }
    
})

Login=asyncHandler(async (req,res)=>{
    const {email,password}=req.body
    const checkUser=await User.findOne({email:email})
    if(checkUser && (await checkUser.isPasswordMatched(password))){ 
        const refreshToken=await genRefreshToken(checkUser._id)
        const updateUser=await User.findByIdAndUpdate(checkUser._id,{refreshToken:refreshToken},{new:true})
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge: 72*60*60*1000
        });
       res.json({
        _id: checkUser._id,
        firstname: checkUser.firstname,
        lastname: checkUser.lastname,
        email: checkUser.email,
        mobile: checkUser.mobile,
        token: genToken(checkUser._id),
      })
    }else{
        throw new Error("Invalid Credentials!")
    }
})


AdminLogin=asyncHandler(async (req,res)=>{
    const {email,password}=req.body
    const checkAdmin=await User.findOne({email:email})
    if(checkAdmin.role !== 'admin') throw new Error('Not Authorized')
    if(checkAdmin && (await checkAdmin.isPasswordMatched(password))){ 
        const refreshToken=await genRefreshToken(checkAdmin._id)
        const updateUser=await User.findByIdAndUpdate(checkAdmin._id,{refreshToken:refreshToken},{new:true})
        res.cookie('refreshToken',refreshToken,{
            httpOnly:true,
            maxAge: 72*60*60*1000
        })
       res.json({
        _id: checkAdmin._id,
        firstname: checkAdmin.firstname,
        lastname: checkAdmin.lastname,
        email: checkAdmin.email,
        mobile: checkAdmin.mobile,
        token: genToken(checkAdmin._id),
      })
    }else{
        throw new Error("Invalid Credentials!")
    } 
})



GetAllUsers=asyncHandler(async(req,res)=>{
    try{
        const data=await User.find()
        res.json(data)
    }catch(err){
        console.log(err)
        console.log("Users Data Not Fetched")
    }
})

GetUser=asyncHandler(async(req,res)=>{
    try{
        validateMongodbid(req.params.id)
        const data=await User.findById(req.params.id)
        res.json(data)
    }catch(err){
        console.log(err)
        console.log("User Data Not Fetched")
    }
})

UpdateUser=asyncHandler(async(req,res)=>{
    try{
        const {id}=req.user
        validateMongodbid(id)
        const data=await User.findByIdAndUpdate(id,req.body,{new:true,})
        res.json(data)
    }catch(err){
        console.log(err)
        console.log("User Data Not Updated")
    }
})

DeleteUser=asyncHandler(async(req,res)=>{
    try{
        validateMongodbid(req.params.id)
        await User.findByIdAndDelete(req.params.id)
        res.json("User Deleted")
    }catch(err){
        console.log(err)
        console.log("User Data Not Deleted")
    }
})

BlockUser=asyncHandler(async(req,res)=>{
    const id=req.params.id
    validateMongodbid(id)
    try{
        const block=await User.findByIdAndUpdate(id,{
            isBlocked:true
        },{
            new:true
        })
        res.json({message:"User Blocked"})
    }catch(err){
        throw new Error(err)
    }
})

UnblockUser=asyncHandler(async(req,res)=>{
    const id=req.params.id
    validateMongodbid(id)
    try{
        const unblock=await User.findByIdAndUpdate(id,{
            isBlocked:false
        },{
            new:true
        })
        res.json({message:"User UnBlocked"})
    }catch(err){
        throw new Error(err)
    }
})

handleRefreshToken=asyncHandler(async(req,res)=>{
    const cookie=req.cookies
    if(!cookie.refreshToken) throw new Error('No Refresh Token in cookies')
    const refreshToken=cookie.refreshToken
    const user=await User.findOne({refreshToken:refreshToken})
    if(!user) throw new Error('No User with this Refresh Token is present in Database!')
    jwt.verify(refreshToken,process.env.SECRET_KEY,(err,decoded)=>{
        if(err || user.id!== decoded.id){
            throw new Error('Something Went Wrong with Refresh Token.')
        }
        const accessToken= genToken(user.id)
        res.json(accessToken)
    })
})

Logout=asyncHandler(async (req,res)=>{
    const cookie=req.cookies
    if(!cookie.refreshToken) throw new Error('There is no token present in cookies!')
    const refreshToken=cookie.refreshToken
    const user= await User.findOne({refreshToken:refreshToken})
    if(!user){
        res.clearCookie('refreshToken',{
            httpOnly:true,
            secure:true,
        })
        res.sendStatus(204)
    }

    await User.findOneAndUpdate(refreshToken,{
        refreshToken:''
    })
    res.clearCookie('refreshToken',{
        httpOnly:true,
        secure:true,
    })
    return res.sendStatus(204)
})

UpdatePassword = async (req,res)=>{
    const id=req.user.id
    const  password= req.body.password
    validateMongodbid(id)
    const user= await User.findById(id)
    if(password){
        user.password=password
        const Updated=await user.save()
        res.json(Updated)
    }else{
        res.json(user)
    }
}

forgotPasswordToken=asyncHandler(async(req,res)=>{
    const email=req.body.email
    const user=await User.findOne({email:email})
    if(!user) throw new Error('User Not Found with mentioned email')
    try{
        const token= await user.resetPasswordToken()
        await user.save()
        const ResetURL= `Follow this link to Reset Password.<a href='http://localhost:6200/api/user/reset-password/${token}'>Click Here<a/>`
        const data={
            to:email,
            text:'Hey User!',
            subject:'Forgot Password Link',
            html:ResetURL
        }
        sendEmail(data)
        res.json(token)
    }catch(err){
        throw new Error(err)
    }
})

resetPassword=asyncHandler(async(req,res)=>{
    const password=req.body.password
    const token= req.params.token
    try{
        const hashedToken=crypto.createHash('sha256').update(token).digest('hex')
        const user= await User.findOne({
            passwordResetToken:hashedToken,
            passwordResetExpires:{
                $gt:Date.now()
            }
        })
        if(!user) throw new Error('Token Expired. Try Again')
        user.password=password
        user.passwordResetToken=undefined
        user.passwordResetExpires=undefined
        await user.save()
        res.json(user)
    }catch(err){
        throw new Error(err)
    }
})

getWishlist=asyncHandler(async(req,res)=>{
    const {id}=req.user
    try{
        const user=await User.findById(id).populate('wishlist')
        res.json(user)
    }catch(err){
        throw new Error(err)
    }
})


saveAddress=asyncHandler(async(req,res)=>{
    const {id}=req.user
    try{
        const user=await User.findByIdAndUpdate(id,{
            address:req?.body.address
        },{new:true})
        res.json(user)
    }catch(err){
        throw new Error(err)
    }
})

userCart=asyncHandler(async(req,res)=>{
    const {id}=req.user
    const cart=req.body.cart
    try{
        let products=[]
        const user= await User.findById(id)
        // Check If User Already have any Items In Cart
        const alreadyExist=await Cart.findOne({orderBy:user._id})
        if(alreadyExist){
            alreadyExist.remove()
        }
        for(let i=0; i<cart.length; i++){
            let object={}
            object.product=cart[i]._id;
            object.count=cart[i].count;
            object.color=cart[i].color;
            let getPrice= await Product.findById(cart[i]._id).select('price').exec()
            object.price=getPrice.price
            products.push(object)
        }
        let cartTotal=0
        for(let i=0; i<products.length; i++){
            cartTotal=cartTotal+products[i].price * products[i].count
        }
        let newCart=await new Cart({
            products,
            cartTotal,
            orderBy:user?._id
        }).save()
        res.json(newCart)
    }catch(err){
        throw new Error(err)
    }
})

getUserCart=asyncHandler(async(req,res)=>{
    const {id}=req.user
    try{
        const cart=await Cart.findOne({orderBy:id}).populate('products.product')
        res.json(cart)
    }catch(err){
        throw new Error(err)
    }
})

emptyCart=asyncHandler(async(req,res)=>{
    const {id}=req.user
    try{
        const user=await User.findById(id)
        const cart=await Cart.findOneAndRemove({orderBy:id})
        res.json(cart)
    }catch(err){
        throw new Error(err)
    }
})

applyCoupon=asyncHandler(async(req,res)=>{
    const coupon=req.body.coupon
    const {id}=req.user
    try{
        const validateCoupon=await Coupon.findOne({name:coupon})
        console.log(validateCoupon)
        if(!validateCoupon) throw new Error('Applied Coupon is not valid')
        const user=await User.findById(id)
        let {products,cartTotal}=await Cart.findOne({orderBy:user._id}).populate('products.product')
        let totalAfterDiscount=(cartTotal-(cartTotal * validateCoupon.discount)/100).toFixed(2)
        await Cart.findOneAndUpdate({orderBy:user._id},{totalAfterDiscount:totalAfterDiscount},{new:true})
        res.json(totalAfterDiscount)
    }catch(err){
        throw new Error(err)
    }
})

createOrder=asyncHandler(async(req,res)=>{
    const {id}=req.user
    const {COD,appliedCoupon}=req.body
    try{
        if(!COD) throw new Error('Create Cash Order Failed!')
        const user=await User.findById(id)
        let userCart=await Cart.findOne({orderBy:user._id})
        let finalOrder=0
        if(appliedCoupon && userCart.totalAfterDiscount){
            finalOrder=userCart.totalAfterDiscount
        }else{
            finalOrder=userCart.cartTotal
        }
        let newOrder=await new Order({
            products:userCart.products,
            paymentIntent:{
                id:uniqid(),
                method:"COD",
                amount:finalOrder,
                status:"Cash On Deivery",
                created:Date.now(),
                currency:'usd'
            },
            orderBy:user._id,
            orderStatus:"Cash On Delivery",
        }).save()
        let update=userCart.products.map((item)=>{
            return {
                updateOne:{
                    filter:{_id:item.product._id},
                    update:{$inc:{quantity: -item.count, sold: +item.count}}
                }
            }
        })
        const updated=await Product.bulkWrite(update,{})
        res.json({message:"Success!"})
    }catch(err){
        throw new Error(err)
    }
})

const getOrder=asyncHandler(async(req,res)=>{
    const {id}=req.user
    try{
        const userOrder= await Order.findOne({orderBy:id}).populate('products.product').exec()
        res.json(userOrder)
    }catch(err){
        throw new Error(err)
    }
})

const updateOrderStatus=asyncHandler(async(req,res)=>{
    const {status}=req.body
    const {id}=req.params
    try{
        const updateOrder=await Order.findByIdAndUpdate(id,
            {
                orderStatus:status,
                paymentIntent:{
                    status:status
                }
            }
            ,{new:true})
            res.json(updateOrder)
    }catch(err){
        throw new Error(err)
    }
})


module.exports={Register,Login,GetAllUsers,GetUser,UpdateUser,DeleteUser,BlockUser,UnblockUser,handleRefreshToken,Logout,UpdatePassword,forgotPasswordToken,resetPassword,AdminLogin,getWishlist,saveAddress,userCart,getUserCart,emptyCart,applyCoupon,createOrder,getOrder,updateOrderStatus}