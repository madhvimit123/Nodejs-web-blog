const express=require('express')
const Blog=require('../models/blog')
const auth= require('../middleware/auth')
const router = new express.Router()


router.post('/blogs',auth,async (req,res)=>{
   
    const blog =  new Blog({
        ...req.body,
        owner: req.user._id
    })
    try{
        await blog.save()
        res.status(201).send(blog)
    }catch(e){
        res.status(400).send(e)
    }
})

router.get('/blogs',auth,async (req,res)=>{
    try{
        await req.user.populate('blogs').execPopulate()
        res.send(req.user.blogs)
    }catch(e){
        res.status(500).send()
    }
})

router.get('/blogs/:id',auth,async (req,res)=>{
    const _id=req.params.id
    try{
        const blog = await Blog.findOne({_id,owner:req.user._id})
        if(!blog){
            return res.status(404).send()
        }
        res.status(200).send(blog)
    }catch(e){
        res.status(500).send()
    }
    
})

router.patch('/blogs/:id',auth,async (req,res)=>{
    const updates= Object.keys(req.body)
    const allowedUpdates=['title','description']
    const isValidOperation= updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates!'})
    }

    try{
        const blog= await Blog.findOne({_id:req.params.id,owner:req.user._id})
      
        
        //const blog = await Blog.findByIdAndUpdate(req.params.id,req.body,{new:true,runValidators:true})
        if(!blog){
            return res.status(404).send('Blog does not exist!')
        } 

        updates.forEach((update)=>blog[update]=req.body[update])
        await blog.save()
        res.send(blog)
    }catch(e){
        res.status(500).send()
    }
})

router.delete('/blogs/:id',auth,async (req,res)=>{
    const _id = req.params.id
    try{
       
        const blog = await Blog.findOneAndDelete({_id:req.params.id,owner:req.user._id })
        if(!blog){
            return res.status(404).send('Blog does not exist!')
        }
        res.status(200).send(blog)
    }catch(e){
        res.status(500).send()
    }
})

module.exports=router