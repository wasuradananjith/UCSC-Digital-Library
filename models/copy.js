const mongoose = require('mongoose');
const schema = mongoose.Schema;

const copySchema = new schema({
    isbn:{type:String,required:true},
    availability:{type:String},
    date_added:{type:String},
    last_borrowed_date:{type:String}
});

const Copy = module.exports = mongoose.model("Copy",copySchema);

module.exports.saveCopy = (newCopy,callback)=>{
    newCopy.save(callback);
};

// checks whether the isbn exists in database
module.exports.findByISBN = (isbn,callback)=> {
    const query = {isbn:isbn};
    Copy.findOne(query,callback);
};
