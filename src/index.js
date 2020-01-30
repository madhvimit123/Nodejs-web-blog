const express=require('express')
require('./db/mongoose')
const User=require('./models/user')
const Blog=require('./models/blog')

const app=express()
const port=process.env.PORT||3000


app.use(express.json())


app.post('/users',async (req,res)=>{
    const user= new User(req.body)
    try{
    await user.save()
    status(201).send(user)
    }
    catch(e){
        res.status(400).send(e)
    }
})

app.get('/users',async (req,res)=>{
    try{
        const users= await User.find({})
        res.status(200).send(users)
    }catch(e){
        res.status(500).send()
    }

    
})

app.get('/users/:id',async (req,res)=>{
    const _id=req.params.id
    try{
        const user=await User.findById(_id)
        if(!user){
            return res.status(404).send('Unable to find the user!')
        }
        res.status(200).send(user)
    }catch(e){
        res.status(500).send()
    }

})

app.patch('/users/:id',async(req,res)=>{
    const updates= Object.keys(req.body)
    const allowedUpdates=['name','email','password']
    const isValidOperation= updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates!'})
    }

    try{
        const user= await User.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!user){
            return res.status(404).send('User does not exist')
        }
        res.status(200).send(user)
    }catch(e){
        res.status(500).send()
    }
})

app.delete('/users/:id',async (req,res)=>{
    const _id=req.params.id
    try{
        const user= await User.findByIdAndDelete({_id})
        if(!user){
            return res.status(400).send('User does not exist!')
        }
        res.status(200).send()
    }catch(e){
        res.status(500).send()
    }
})

app.post('/blogs',async (req,res)=>{
    const blog= new Blog(req.body)
    try{
        await blog.save()
        res.status(201).send(blog)
    }catch(e){
        res.status(400).send(e)
    }
})

app.get('/blogs',async (req,res)=>{
    try{
        const blogs=await Blog.find({})
        res.status(200).send(blogs)
    }catch(e){
        res.status(500).send()
    }
})

app.get('/blogs/:id',async (req,res)=>{
    const _id=req.params.id
    try{
        const blog=await Blog.findById(_id)
        if(!blog){
            return res.status(404).send('No blog exists!')
        }
        res.status(200).send(blog)
    }catch(e){
        res.status(500).send()
    }
    
})

app.patch('/blogs/:id',async (req,res)=>{
    const updates= Object.keys(req.body)
    const allowedUpdates=['title','description']
    const isValidOperation= updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates!'})
    }

    try{
        const blog = await Blog.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!blog){
            return res.status(404).send('Blog does not exist!')
        } 
        res.status(500).send(blog)
    }catch(e){
        res.status(500).send()
    }
})

app.delete('/blogs/:id',async (req,res)=>{
    const _id = req.params.id
    try{
        const blog= await Blog.findByIdAndDelete({_id})
        if(!blog){
            return res.status(404).send('Blog does not exist!')
        }
        res.status(200).send()
    }catch(e){
        res.status(500).send()
    }
})



app.listen(port,()=>{
    console.log('Server up at port',port)
})