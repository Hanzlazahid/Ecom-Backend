const mongoose=require('mongoose')

const BlogSchema=mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    category:{
        type:String,
        required:true
    },
    numViews:{
        type:Number,
        default:0
    },
    isLiked:{
        type:Boolean,
        default:false
    },
    isDisliked:{
        type:Boolean,
        default:false
    },
    likes:[
        {
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
       }
    ],
    dislikes:[{
        type:mongoose.Schema.Types.ObjectId,
        ref:'User'
    }],
    image:{
        type:Array,
        default:'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSB7Rthwkw1Bc4XIatkTYlvl6ULjnFt2W2hFEkxFIcb4Q&s'
    },
    author:{
        type:String,
        default:'Admin'
    },
},
{
    toJson:{
        virtuals:true
    },
    toObject:{
        virtuals:true
    },
    timestamps:true
})

module.exports=mongoose.model('Blog',BlogSchema)