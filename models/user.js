const mongoose = require('mongoose');
const bcrypt  = require('bcryptjs');
const schema = mongoose.Schema;

const userSchema = new schema({
    email:{type:String,required:true},
    name:{type:String,required:true},
    password:{type:String,required:true},
    type:{type:String},
    lastLogin:{type:String},
    isDeleted:{type:String},
    isLostPassword:{type:String}
});

const User = module.exports = mongoose.model("User",userSchema);

module.exports.saveUser = (newUser,callback)=>{
    bcrypt.genSalt(10, (err, salt)=> {
        bcrypt.hash(newUser.password, salt, (err, hash)=> {
            newUser.password = hash;
            if (err) {
                callback(null,false);
            }
            newUser.save(callback);
        });
    });
};

// checks whether the email exists in database
module.exports.findByEmail = (user,callback)=> {
    const query = {email:user.email}; // checks whether the email field of database matches with the passed email
    User.findOne(query,callback);
};

// check whether the entered password matches with the password stored in the database
module.exports.passwordCheck = (plainpassword,hash,callback)=> {

    bcrypt.compare(plainpassword, hash, function(err, res) {
        if(err) throw  err;

        if (res){
            callback(null,res);
        } else{
            callback(null,false)
        }
    });
};

module.exports.findUserById = (id,callback)=>{
    User.findOne(id,callback);
};