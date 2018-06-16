const mongoose = require('mongoose');
const schema = mongoose.Schema;

const returnSchema = new schema({
    email:{type:String},
    student:{type:Object},
    isbn:{type:String},
    title:{type:String},
    author:{type:String},
    subject:{type:String},
    borrowed_date:{type:String},
    returned_date:{type:String},
    fine:{type:String},
    copy:{type:Object}
});

const Return = module.exports = mongoose.model("Return",returnSchema);

// add a new borrowed book record
module.exports.saveReturn = (newReturn,callback)=>{
    newReturn.save(callback);
};

// fetch all the reservations
module.exports.searchReturnedBooks = (searchText,callback)=> {
    let text = "/"+searchText+"/i";
    Return.find({$or:[{title: new RegExp(searchText, "i")},
            {isbn: new RegExp(searchText, "i")},
            {author: new RegExp(searchText, "i")},
            {subject: new RegExp(searchText, "i")},
            {email: new RegExp(searchText, "i")},
            {"student.reg_no": new RegExp(searchText, "i")},
            {"student.index_no": new RegExp(searchText, "i")},
            {"student.name": new RegExp(searchText, "i")},
            {"student.phone": new RegExp(searchText, "i")},
            {"student.address": new RegExp(searchText, "i")},
            {"student.nic": new RegExp(searchText, "i")}
        ]}, callback).sort({ title: 1 });
};