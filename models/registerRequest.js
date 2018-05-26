const mongoose = require('mongoose');
const bcrypt  = require('bcryptjs');
const schema = mongoose.Schema;


const registerRequestSchema = new schema({
    email:{type:String,required:true},
    name:{type:String,required:true},
    password:{type:String,required:true},
    type:{type:String},
    lastLogin:{type:String},
    isDeleted:{type:String},
    isLostPassword:{type:String}
});

const RegisterRequest = module.exports = mongoose.model("RegisterRequest",registerRequestSchema);

module.exports.saveRegisterRequest = (newUser,callback)=>{
    bcrypt.genSalt(10, (err, salt)=> {
        bcrypt.hash(newUser.password, salt, (err, hash)=> {
            newUser.password = hash;
            if (err) throw err;
            newUser.save(callback);
        });
    });
};

