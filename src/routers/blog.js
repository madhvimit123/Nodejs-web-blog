const express=require('express')
const Blog=require('../models/blog')
const router = new express.Router()


router.post('/blogs',async (req,res)=>{
    const blog= new Blog(req.body)
    try{
        await blog.save()
        res.status(201).send(blog)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/blogs',async (req,res)=>{
    try{
        const blogs=await Blog.find({})
        res.status(200).send(blogs)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/blogs/:id',async (req,res)=>{
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

router.patch('/blogs/:id',async (req,res)=>{
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

router.delete('/blogs/:id',async (req,res)=>{
    const _id = req.params.id
    try{
        const blog= await Blog.findByIdAndDelete({_id})
        if(!blog){
            return res.status(404).send('Blog does not exist!')
        }
        res.status(200).send(blog)
    }catch(e){
        res.status(500).send()
    }
})

module.exports=router