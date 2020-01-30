const express=require('express')
require('./db/mongoose')
const User=require('./models/user')
const Blog=require('./models/blog')
const userRouter=require('./routers/user')
const blogRouter=require('./routers/blog')


const app=express()
const port=process.env.PORT||3000


app.use(express.json())
app.use(userRouter)
app.use(blogRouter)


app.listen(port,()=>{
    console.log('Server up at port',port)
})