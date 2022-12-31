const express=require('express')
const {createBlog,updateBlog,getBlog,getAllBlog,deleteBlog,likeBlog,dislikeBlog,uploadImg}=require('../controller/BlogController')
const {uploadPhoto,  blogImgResize}=require('../middlewares/UploadImages')
const {authMiddleware,isAdmin}=require('../middlewares/AuthMiddleware.js')
const router=express.Router()

router.post('/',authMiddleware,isAdmin,createBlog)
router.get('/',authMiddleware,isAdmin,getAllBlog)
router.patch('/likes',authMiddleware,likeBlog)
router.patch('/dislikes',authMiddleware,dislikeBlog)
router.put('/upload/:id',authMiddleware,isAdmin,uploadPhoto.array('images',2),blogImgResize,uploadImg)
router.patch('/:id',authMiddleware,isAdmin,updateBlog)
router.get('/:id',authMiddleware,isAdmin,getBlog)
router.delete('/:id',authMiddleware,isAdmin,deleteBlog)

module.exports=router