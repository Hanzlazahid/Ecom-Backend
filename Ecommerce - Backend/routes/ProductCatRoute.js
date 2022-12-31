const express=require('express')
const {createCat,getCat,getAllCat,deleteCat,updateCat}=require('../controller/ProductCategoryController')
const {authMiddleware,isAdmin}=require('../middlewares/AuthMiddleware.js')
const router=express.Router()

router.post('/',authMiddleware,isAdmin,createCat)
router.get('/',authMiddleware,getAllCat)
router.patch('/:id',authMiddleware,isAdmin,updateCat)
router.get('/:id',authMiddleware,getCat)
router.delete('/:id',authMiddleware,isAdmin,deleteCat)

module.exports=router