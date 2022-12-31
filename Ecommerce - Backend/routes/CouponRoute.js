const express=require('express')
const {isAdmin,authMiddleware} =require('../middlewares/AuthMiddleware')
const {getAllCoupon,getCoupon,deleteCoupon,updateCoupon,createCoupon}=require('../controller/CouponController')
const router=express.Router()

router.get('/',authMiddleware,isAdmin,getAllCoupon)
router.post('/',authMiddleware,isAdmin,createCoupon)
router.patch('/:id',authMiddleware,isAdmin,updateCoupon)
router.delete('/:id',authMiddleware,isAdmin,deleteCoupon)

module.exports=router