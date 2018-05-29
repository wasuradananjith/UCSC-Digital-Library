const express = require('express');
const router = express.Router();
const User = require('../models/user');
const Student = require('../models/student');

const jwt = require('jsonwebtoken');
const config = require('../config/database');
const passport = require('passport');

router.get("",(req,res)=>{
    res.send("Hello Users");
});

router.post("/register",(req,res)=>{
    const newUser = new User({
        email:req.body.email,
        name:req.body.name,
        password:req.body.password,
        type:req.body.type,
        lastLogin:req.body.lastLogin,
        isDeleted:req.body.isDeleted,
        isLostPassword:req.body.isLostPassword
    });


    User.findByEmail(newUser.email,(err,user)=>{
        // if not a user already, then register
        if(!user){
            Student.findByEmail(newUser.email, (err,student)=>{
                // not a registered student, so cannot have library access
                if (!student){
                    res.json({state:false,msg:"Sorry, you are not a registered student in UCSC"});
                }
                // registered student in the university, so can have library access
                if (student){
                    User.saveUser(newUser,(err,user)=> {
                        if(err){
                            res.json({state:false,msg:"Registration unsuccessful"});
                        }
                        if(user){
                            res.json({state:true,msg:"You have successfully registered"});
                        }
                    });
                }
                // if error
                if (err){
                    res.json({state:false,msg:"Registration unsuccessful"});
                }
            });
        }
        // if an existing user
        if (user){
            res.json({state:false,msg:"You are already registered"});
        }
        // if error
        if (err){
            res.json({state:false,msg:"Registration unsuccessful"});
        }
    });
});


router.post("/login",(req,res)=>{
    const email = req.body.email;
    const password = req.body.password;

    // checks whether the user exists
    User.findByEmail(email, (err,user)=> {
        if(err) throw err;

        if (!user){
            res.json({state:false,msg:"Sorry, No user found"});
            return false;

        }

        // if there is a user, check the password
        User.passwordCheck(password,user.password,(err,match)=> {
            if (err) throw  err;

            if (match){
                // create a token when a successful login happens
                const token = jwt.sign(user, config.secret,{expiresIn:86400}); // expires in oneday
                res.json(
                    {
                        state:true,
                        token:"JWT " + token,
                        user:{
                            id:user._id,
                            name:user.name,
                            email:user.email,
                            type:user.type
                        },
                        msg:"Login Successful!"
                    }
                )
            }
            else{
                res.json({state:false,msg:"Password does not match"});
            }
        });
    });
});

router.get('/admin-home', passport.authenticate('jwt', { session: false}), (req, res)=> {
        res.json({user:req.user});
    }
);

router.get('/student-home', passport.authenticate('jwt', { session: false}), (req, res)=> {
        res.json({user:req.user});
    }
);

module.exports = router;