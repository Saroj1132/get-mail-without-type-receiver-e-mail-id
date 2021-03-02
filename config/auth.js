const tbluser=require('../model/user')
const jwt=require('jsonwebtoken')

var auth=async(req, res, next)=>{
    if(req.session.user){
        var token=req.session.user
        var decode=jwt.verify(token, "mykey123")
        var user=await tbluser.findOne({Email:decode.Email, Name:decode.Name})

        req.user=user

        next()
    }else{
        res.redirect('/login')
    }
}

module.exports={
    auth
}