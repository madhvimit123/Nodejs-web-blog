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
    }
},{
    timestamps:true
})

const Blog=mongoose.model('Blog',blogSchema)

module.exports=Blog