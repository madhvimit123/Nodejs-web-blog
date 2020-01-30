const mongoose=require('mongoose')

const connectionURL= 'mongodb://127.0.0.1:27017/web-blog-app'
mongoose.connect(connectionURL,{
    useUnifiedTopology:true,
    useNewUrlParser:true,   
    useCreateIndex:true
})

