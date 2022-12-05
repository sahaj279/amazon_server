const mongoose=require('mongoose')

const UserSchema =mongoose.Schema({
    name:{
        type: String,
        require: true,
        trim: true
    },
    email:{
        require: true,
        trim: true,
        type : String,
        validate:{
            validator:(value)=>{
                const re= /^\w+@[a-zA-Z_]+?\.[a-zA-Z]{2,3}$/
                return value.match(re)
            },
            message:
                'Please enter a valid email'
            ,
        }
    },
    password:{
        require:true,
        type: String,
        validate:{
            validator:(value)=>{
                
                return value.length>6
            },
            message:
                'Password must have atleast 6 characters'
            ,
        }
    },
    address:{
        type:String,
        default:"",
    },type:{
        type: String,
        default: "user",
    },
    //cart
})

const User=mongoose.model("User",UserSchema)
module.exports=User;