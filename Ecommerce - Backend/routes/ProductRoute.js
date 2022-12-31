const express = require("express")
const {isAdmin,authMiddleware} =require('../middlewares/AuthMiddleware')
const {uploadPhoto, productImgResize}=require('../middlewares/UploadImages')
const {CreateProduct,GetAllProduct,GetProduct,UpdateProduct,DeleteProduct,addToWishList,rating,uploadImg}=require('../controller/ProductController')

const router=express.Router()

router.post('/',authMiddleware,isAdmin,CreateProduct)
router.get('/',GetAllProduct)
router.patch('/wishlist',authMiddleware,addToWishList)
router.patch('/rating',authMiddleware,rating)
router.put('/upload/:id',authMiddleware,isAdmin,uploadPhoto.array('images',10),productImgResize,uploadImg)
router.get('/:id',GetProduct)
router.patch('/:id',authMiddleware,isAdmin,UpdateProduct)
router.delete('/:id',authMiddleware,isAdmin,DeleteProduct)




module.exports=router