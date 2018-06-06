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
