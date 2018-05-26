const mongoose = require('mongoose');
const schema = mongoose.Schema;

const userSchema = new schema({
    email:{type:String,required:true},
    name:{type:String,required:true},
    password:{type:String,required:true},
    type:{type:String},
    lastLogin:{type:String},
    isDeleted:{type:String},
    isLostPassword:{type:String},
});
