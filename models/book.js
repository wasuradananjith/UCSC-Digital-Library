const mongoose = require('mongoose');
const schema = mongoose.Schema;

const bookSchema = new schema({
    isbn:{type:String,required:true},
    title:{type:String,required:true},
    author:{type:String,required:true},
    subject:{type:String,required:true},
    no_of_copies:{type:Number},
    no_of_available_copies:{type:Number},
    no_of_borrowed_copies:{type:Number},
    no_of_reserved_copies:{type:Number},
    copies:{

    }
});

const Book = module.exports = mongoose.model("Book",bookSchema);

module.exports.saveBook = (newBook,callback)=>{
    newBook.save(callback);
};

// checks whether the isbn exists in database
module.exports.findByISBN = (isbn,callback)=> {
    const query = {isbn:isbn};
    Book.findOne(query,callback);
};

// fetch all the books
module.exports.getAllBooks = (callback)=> {
    Book.find({},callback);
};

// fetch all the books
module.exports.getFilteredBooks = (searchText,callback)=> {
    let text = "/"+searchText+"/i";
    console.log(text);
    Book.find({$or:[{title: new RegExp(searchText, "i")},
            {isbn: new RegExp(searchText, "i")},
            {author: new RegExp(searchText, "i")},
            {subject: new RegExp(searchText, "i")}]}, callback);
};

// reserve a book copy
module.exports.reserveBookCopy = (reservation,callback)=> {

     /*Book.findOneAndUpdate({isbn:isbn},{no_of_available_copies:book.no_of_available_copies-1,no_of_reserved_copies:book.no_of_reserved_copies+1,
         copies:book.copies},callback);*/
    Book.findOneAndUpdate({isbn:reservation[0].isbn},{$inc:{no_of_available_copies:-1,no_of_reserved_copies:1},$set:{copies:reservation}},callback);
};
