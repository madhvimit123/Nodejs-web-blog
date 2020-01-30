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
        res.status(201).send(user)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

app.get('/users',(req,res)=>{
    User.find({}).then((users)=>{
        res.status(200).send(users)
    }).catch((e)=>{
        res.status(500).send()
    })
    
})

app.get('/users/:id',(req,res)=>{
    const _id=req.params.id

    User.findById(_id).then((user)=>{
      if(!user){
          return res.status(404).send('Unable to find the user!')
      }
      res.status(200).send(user)
    }).catch((e)=>{
        res.status(500).send()
    })
})

app.post('/blogs',(req,res)=>{
    const blog= new Blog(req.body)
    blog.save().then(()=>{
        res.status(201).send(blog)
    }).catch((e)=>{
        res.status(400).send(e)
    })
})

app.get('/blogs',(req,res)=>{
    Blog.find({}).then((blogs)=>{
        res.status(200).send(blogs)
    }).catch((e)=>{
        res.status(500).send()
    })
})

app.get('/blogs/:id',(req,res)=>{
    const _id=req.params.id

    Blog.findById(_id).then((blog)=>{
        if(!blog){
            return res.status(404).send('No blog exists!')
        }
        res.status(200).send(blog)
    }).catch((e)=>{
        res.status(500).send()
    })
})

app.listen(port,()=>{
    console.log('Server up at port',port)
})