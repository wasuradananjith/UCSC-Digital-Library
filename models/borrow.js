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
