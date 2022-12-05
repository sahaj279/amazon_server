//DEV IMPORTS
const express =require ('express');
const mongoose=require('mongoose')
const cors=require('cors');

//FILE IMPORTS
const authRouter=require('./routes/auth')

//INITIALIZATIONS
const PORT=3000;
const app =express();
const DB="mongodb+srv://sahaj_279:chennaiexpress1A@cluster0.fktjfco.mongodb.net/?retryWrites=true&w=majority"

//MIDDLEWARES
app.use(express.json())
app.use(authRouter)
// app.use(cors)

mongoose.connect(DB).then(()=>{
    console.log("Connection Successful with mongoDB")
}).catch((e)=>{
    console.log(e)
})

//CREATING AN API
app.get("/hello",(req,res)=>{
    res.json({name:'Sahaj'});
});

app.listen(PORT,"0.0.0.0",()=>{
    console.log(`connect at port ${PORT}`);
});