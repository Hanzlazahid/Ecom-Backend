const mongoose = require('mongoose')


const dbConnect=()=>{

    const DB=process.env.URI
    mongoose.set('strictQuery', false);
    mongoose.connect(DB,{
        useNewUrlParser:true
    }).then(()=>{
        console.log("Database Connected Successfully")
    }).catch((err)=>{
        console.log("Database not connected!")
        console.log(err)
    })
}

module.exports=dbConnect