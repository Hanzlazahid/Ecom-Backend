const express=require('express')
const dotenv=require('dotenv')
const Conn=require('./config/Db')
const authRoute=require('./routes/AuthRoute')
const productRoute=require('./routes/ProductRoute')
const blogRoute=require('./routes/BlogRoute')
const PcatRoute=require('./routes/ProductCatRoute')
const BcatRoute=require('./routes/BlogCatRoute')
const BrandRoute=require('./routes/BrandRoute')
const CouponRouter=require('./routes/CouponRoute')
const {notFound,errorHandler}=require('./middlewares/ErrorHandler')
const cookieParser = require('cookie-parser')
const morgan=require('morgan')

dotenv.config({path:"./config.env"})
const app=express()
app.use(morgan('dev'))
const PORT=process.env.PORT || 6200

Conn();

app.use(express.json())
app.use(cookieParser())
app.use('/api/user',authRoute)
app.use('/api/product',productRoute)
app.use('/api/blog',blogRoute)
app.use('/api/pcat',PcatRoute)
app.use('/api/bcat',BcatRoute)
app.use('/api/brand',BrandRoute)
app.use('/api/coupon',CouponRouter)

app.use(notFound)
app.use(errorHandler)



app.listen(PORT,()=>{
    console.log(`The Server Is Running on http://localhost:${PORT}`)
})