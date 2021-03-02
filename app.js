var express = require('express');
var path = require('path');
var nodemailer=require('nodemailer')
var userlogin=require('./model/user')
var mongoose=require('mongoose')
var jwt=require('jsonwebtoken')
var session=require('express-session')

const db=require('./config/db');
const { auth } = require('./config/auth');
const user = require('./model/user');
var app = express();

app.use(session({
  secret:'emailcode',
  saveUninitialized:true,
  resave:false
}))


mongoose.connect(db.url, (err, res)=>{
  console.log('Connection succesfully')
})

//setup of the mail

//if you can't send mail then on less secure apps 
var transport=nodemailer.createTransport({
  service: 'gmail',
  auth:{
      user: "your mail" ,
      pass: "your password"
  }
})

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.get('/info', auth,(req, res)=>{
  res.render('index', {status:""})
})

app.post('/info', auth,(req, res)=>{
    var mailoption = {
      from: "sarojpanigrahi719@gmail.com",
      to: req.user.Email,
      subject: "test",
      text: `${req.user.Name} your message is ${req.body.text}`,
      
  }
  //console.log("callupdate")
  transport.sendMail(mailoption, (req, res) => {
      //console.log(req.body)
      console.log("Mail send succesfully")
  })

  res.render("index",{status:"send mail sucessfully!!!"})
})

app.get('/login', (req, res)=>{
  res.render("login")
})

//not create a user registration, internally insert the email and password of the user

//after login user can type the details in info page that he/she recevied that details by his/her email with typing email address

app.post('/login', (req, res)=>{
  const {Email, Password}=req.body
  userlogin.findOne({Email:Email, Password:Password})
  .exec()
  .then(doc=>{
    if(doc){
      //here i am write the code of jwt and set the email in jwt , that receiver get the all details in mail which he/she can type in info page with typing  email-id
      var token=jwt.sign({
        Email:doc.Email,
        Name:doc.Name
      },"mykey123")
      req.session.user=token
      res.redirect('/info')
      console.log(token)
    }else{
      res.send("inc")
    }
  })
})

app.listen(3000)