const mongoose=require('mongoose')
const validator=require('validator')
const bcrypt=require('bcryptjs')
const jwt= require('jsonwebtoken')
const Blog = require('./blog')

//User Schema
const userSchema= new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true
    },
    email:{
        type:String,
        unique:true,
        required:true,
        trim:true,
        lowercase: true,
        validate(value){
            if(!validator.isEmail(value)){
                throw new Error('Email is invalid')
            }
        }
    },
    password:{
        type:String,
        required: true,
        trim:true,
        minlength:7,
        validate(value){
            if(value.toLowerCase().includes('password')){
                throw new Error('Password cannot contain password')
            }
        }
    },
    tokens:[{
        token:{
            type: String,
            required:true
        }
    }]


},{
    timestamps:true
})

// Function to connect to the user's blog
userSchema.virtual('blogs',{
    ref: 'Blog',
    localField: '_id',
    foreignField: 'owner'
})

// Function to generate token

userSchema.methods.generateAuthToken= async function(){
    const user=this
    const token = jwt.sign({_id:user._id.toString()},'thisismywebblogapp')
    user.tokens=user.tokens.concat({token})
    await user.save()
    return token
}

// Function to hide private data like passwords and tokens
userSchema.methods.toJSON=function(){
    const user=this
    const userObject = user.toObject()

    delete userObject.password
    delete userObject.tokens
    return userObject
}


// Function to check the credentials of logging in user exist or not in database

userSchema.statics.findByCredentials = async (email,password)=>{
    const user = await User.findOne({email})
    if(!user){
        throw new Error('Unable to login')
    }
    const isMatch= await bcrypt.compare(password,user.password)
    if(!isMatch){
        throw new Error('Unable to login')
    }
    return user
}

// Function to encode password before saving in database

userSchema.pre('save',async function(next){
    const user=this
    if(user.isModified('password')){
        user.password = await bcrypt.hash(user.password,8)
    }
    next()
})

//Function to remove all the blogs of the user who is deleting his account

userSchema.pre('remove',async function(next){
    const user = this
    await Blog.deleteMany({owner: user._id})

    next()
})

const User= mongoose.model('User',userSchema)

module.exports=User