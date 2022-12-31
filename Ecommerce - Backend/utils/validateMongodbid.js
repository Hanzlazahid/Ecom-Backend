const mongoose=require('mongoose')

const validateMongodbid=(id)=>{
    const isValid=mongoose.Types.ObjectId.isValid(id)
    if(!isValid) throw new Error('Id is not Valid or not found')
}

module.exports={validateMongodbid}