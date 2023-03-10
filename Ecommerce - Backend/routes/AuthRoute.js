const express= require('express')
const {Register,Login,GetAllUsers,GetUser,UpdateUser,DeleteUser,BlockUser,UnblockUser,handleRefreshToken,Logout,UpdatePassword,forgotPasswordToken,resetPassword,AdminLogin,getWishlist,saveAddress,userCart,getUserCart,emptyCart,applyCoupon,createOrder,getOrder,updateOrderStatus}=require('../controller/UserControler')
const {authMiddleware,isAdmin}=require('../middlewares/AuthMiddleware.js')
const router=express.Router()

router.post('/register',Register)
router.post('/login',Login)
router.post('/admin-login',AdminLogin)
router.get('/allusers',GetAllUsers)
router.get('/refresh',handleRefreshToken)
router.get('/logout',Logout)
router.post('/forgot-password-token',forgotPasswordToken)
router.post('/cart/apply-coupon',authMiddleware,applyCoupon)
router.post('/cart/cash-order',authMiddleware,createOrder)
router.get('/get-order',authMiddleware,getOrder)
router.patch('/order/update-order/:id',authMiddleware,isAdmin,updateOrderStatus)
router.patch('/reset-password/:token',resetPassword)
router.get('/wishlist',authMiddleware,getWishlist)
router.post('/cart',authMiddleware,userCart)
router.get('/cart',authMiddleware,getUserCart)
router.delete('/empty-cart',authMiddleware,emptyCart)
router.delete('/:id',DeleteUser)
router.patch('/save-address',authMiddleware,saveAddress)
router.patch('/password',authMiddleware,UpdatePassword)
router.get('/:id',authMiddleware,isAdmin,GetUser)
router.patch('/edit-user',authMiddleware,UpdateUser)
router.patch('/block-user/:id',authMiddleware,isAdmin,BlockUser)
router.patch('/unblock-user/:id',authMiddleware,isAdmin,UnblockUser)

module.exports=router