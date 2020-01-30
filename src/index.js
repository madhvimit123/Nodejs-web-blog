const express=require('express')
require('./db/mongoose')
const User=require('./models/user')
const Blog=require('./models/blog')

const app=express()
const port=process.env.PORT||3000


app.use(express.json())


app.post('/users',(req,res)=>{
    const user= new User(req.body)
    user.save().then(()=>{
        res.send(user)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

app.post('/blogs',(req,res)=>{
    const blog= new Blog(req.body)
    blog.save().then(()=>{
        res.send(blog)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})


app.listen(port,()=>{
    console.log('Server up at port',port)
})