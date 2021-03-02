const mongoose=require('mongoose')

const mongooseschema=mongoose.Schema({
    //i'm not create a Registartion of table user only create a login api
    Name:{
        type:String,
        require:true
    },
    Email:{
        type:String,
        require:true
    },
    Password:{
        type:String,
        require:true
    }
})

const user=mongoose.model('users',mongooseschema)

module.exports=user