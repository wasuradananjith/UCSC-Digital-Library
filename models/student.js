const mongoose = require('mongoose');
const schema = mongoose.Schema;

const studentSchema = new schema({
    name:{type:String},
    reg_no:{type:String},
    index_no:{type:String},
    phone:{type:String},
    address:{type:String},
    nic:{type:String}
});

const Student = module.exports = mongoose.model("Student",studentSchema);

// checks whether the email exists in database
module.exports.findByEmail = (student,callback)=> {
    const query = {email:student.email}; // checks whether the email field of database matches with the passed email
    Student.findOne(query,callback);
};