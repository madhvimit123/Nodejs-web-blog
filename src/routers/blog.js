const express=require('express')
const Blog=require('../models/blog')
const auth= require('../middleware/auth')
const router = new express.Router()

// Router for creating a blog
router.post('/blogs',auth,async (req,res)=>{
   
    const blog =  new Blog({
        ...req.body,
        owner: req.user._id
    })
    const count= await Blog.find({owner:req.user._id}).count()
    
    try{
        if(count<=4){
            await blog.save()
            res.status(201).send(blog)
        }
        else if(count==5){
            return res.send('Limit exceeded!')
        }
        
    }catch(e){
        res.status(400).send(e)
    }
})

// Router to the logged in user's blog
router.get('/blogs',auth,async (req,res)=>{
    try{
        await req.user.populate('blogs').execPopulate()
        res.send(req.user.blogs)
    }catch(e){
        res.status(500).send()
    }
})

// Router to view all the public blogs 
router.get('/blogs/allBlogs',auth,async (req,res)=>{
    try{
        const allblogs= await Blog.find({$or:[{property:0},{owner:req.user._id}]})
        if(!allblogs){
            return res.send('No blogs')
        }
        res.status(200).send(allblogs)
        console.log(allblogs)
    }catch(e){
        res.status(400).send()
    }
})

// Router to view a specific blog by entering the _id of the logged in user
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

//Router to update a specific blog of logged in user. Selecting a blog on the basis of id
router.patch('/blogs/:id',auth,async (req,res)=>{
    const updates= Object.keys(req.body)
    const allowedUpdates=['title','description']
    const isValidOperation= updates.every((update)=>allowedUpdates.includes(update))
    if(!isValidOperation){
        return res.status(400).send({error:'Invalid updates!'})
    }

    try{
        const blog= await Blog.findOne({_id:req.params.id,owner:req.user._id})
      
        
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

// Router to delete a blog of the logged in user
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