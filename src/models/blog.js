const mongoose= require('mongoose')
const validator = require('validator')

const blogSchema=new mongoose.Schema({
    title:{
        type:String,
        trim:true,
        required:true
    },
    description:{
        type:String,
        trim:true,
        required:true
    },
    owner:{
        type:mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User'
    },
    property:{
        type: Number,
        required: true  //0 for public and 1 for private
    }
},{
    timestamps:true
})

const Blog=mongoose.model('Blog',blogSchema)

module.exports=Blog