const mongoose = require('mongoose');
const schema = mongoose.Schema;

const borrowSchema = new schema({
    email:{type:String},
    student:{type:Object},
    isbn:{type:String},
    title:{type:String},
    author:{type:String},
    subject:{type:String},
    borrowed_date:{type:String},
    return_date:{type:String},
    fine:{type:String},
    copy:{type:Object}
});

const Borrow = module.exports = mongoose.model("Borrow",borrowSchema);

// add a new borrowed book record
module.exports.saveBorrow = (newBorrow,callback)=>{
    newBorrow.save(callback);
};

// get all borrow details
module.exports.getAllBorrows = (callback)=>{
    Borrow.find({},callback);
};

// update borrow
module.exports.updateBorrow = (borrow,callback)=> {
    Borrow.findOneAndUpdate({email:borrow.email,isbn:borrow.isbn,borrowed_date:borrow.borrowed_date},{fine:borrow.fine},callback);
};

// fetch all the reservations
module.exports.searchBorrow = (searchText,callback)=> {
    let text = "/"+searchText+"/i";
    Borrow.find({$or:[{title: new RegExp(searchText, "i")},
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

// delete a reservation
module.exports.deleteBorrow = (book,callback)=>{
    Borrow.findOneAndDelete({_id:book._id},callback);
};


// get borrow count for a particular user
module.exports.getCount = (email,callback)=>{
    Borrow.count({email:email},callback);
};

// check whether the student borrowing the same book twice
module.exports.checkSimilarBooks = (details,callback)=>{
    Borrow.find(details,callback);
};