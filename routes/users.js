const express = require('express');
const router = express.Router();
const User = require('../models/user');
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


    User.saveUser(newUser,(err,user)=> {
        if(err){
            res.json({state:false,msg:"data not inserted"});
        }
        if(user){
            res.json({state:true,msg:"data  inserted"});
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
            res.json({state:false,msg:"No user found"});
            return false;

        }

        // if there is a user, check the password
        User.passwordCheck(password,user.password,(err,match)=> {
            if (err) throw  err;

            if (match){
                // create a token when a successful login happens
                const token = jwt.sign(user.toJSON(), config.secret,{expiresIn:86400}); // expires in oneday
                res.json(
                    {
                        state:true,
                        token:"JWT " + token,
                        user:{
                            id:user._id,
                            name:user.name,
                            email:user.email
                        }
                    }
                )
            }
            else{
                res.json({state:false,msg:"password does not match"});
            }
        });
    });
});

router.post('/profile', passport.authenticate('jwt', { session: false}), (req, res)=> {
        res.json({user:req.user});
    }
);


module.exports = router;