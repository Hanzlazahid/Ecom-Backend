const express=require('express')
const {createBrand,getAllBrand,updateBrand,getBrand,deleteBrand}=require('../controller/BrandController')
const {authMiddleware,isAdmin}=require('../middlewares/AuthMiddleware.js')
const router=express.Router()

router.post('/',authMiddleware,isAdmin,createBrand)
router.get('/',authMiddleware,getAllBrand)
router.patch('/:id',authMiddleware,isAdmin,updateBrand)
router.get('/:id',authMiddleware,getBrand)
router.delete('/:id',authMiddleware,isAdmin,deleteBrand)

module.exports=router