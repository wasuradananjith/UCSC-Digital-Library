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
module.exports.findByEmail = (email,callback)=> {
    const query = {email:email}; // checks whether the email field of database matches with the passed email
    Student.findOne(query,callback);
};

// fetch filtered student details
module.exports.getFilteredStudents = (searchText,callback)=> {
    let text = "/"+searchText+"/i";
    Student.find({$or:[{name: new RegExp(searchText, "i")},
            {reg_no: new RegExp(searchText, "i")},
            {index_no: new RegExp(searchText, "i")},
            {email: new RegExp(searchText, "i")},
            {address: new RegExp(searchText, "i")},
            {nic: new RegExp(searchText, "i")},
            {phone: new RegExp(searchText, "i")}]}, callback).sort({ index_no: 1 });
};
