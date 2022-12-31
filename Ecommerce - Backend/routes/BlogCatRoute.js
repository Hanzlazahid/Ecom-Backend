const express=require('express')
const {createBlog,getBlog,getAllBlog,deleteBlog,updateBlog}=require('../controller/BlogCatController')
const {authMiddleware,isAdmin}=require('../middlewares/AuthMiddleware.js')
const router=express.Router()

router.post('/',authMiddleware,isAdmin,createBlog)
router.get('/',authMiddleware,getAllBlog)
router.patch('/:id',authMiddleware,isAdmin,updateBlog)
router.get('/:id',authMiddleware,getBlog)
router.delete('/:id',authMiddleware,isAdmin,deleteBlog)

module.exports=router