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
    Book.find({},callback).sort({ _id: -1 });
};

// fetch filtered book details
module.exports.getFilteredBooks = (searchText,callback)=> {
    let text = "/"+searchText+"/i";
    Book.find({$or:[{title: new RegExp(searchText, "i")},
            {isbn: new RegExp(searchText, "i")},
            {author: new RegExp(searchText, "i")},
            {subject: new RegExp(searchText, "i")}]}, callback).sort({ title: 1 });
};


// reserve a book copy
module.exports.reserveBookCopy = (reservation,callback)=> {
    Book.findOneAndUpdate({isbn:reservation[0].isbn},{$inc:{no_of_available_copies:-1,no_of_reserved_copies:1},$set:{copies:reservation}},callback);
};

// update book when borrowing a reserved book
module.exports.updateBookOnReserveBorrow = (book,callback)=> {
    Book.findOneAndUpdate({isbn:book.isbn},{$inc:{no_of_borrowed_copies:+1,no_of_reserved_copies:-1},$set:{copies:book.copies}},callback);
};

// update book on borrow
module.exports.updateBook = (book,callback)=> {
    Book.findOneAndUpdate({isbn:book.isbn},{$inc:{no_of_borrowed_copies:+1,no_of_available_copies:-1},$set:{copies:book.copies}},callback);
};

// update book on borrow
module.exports.updateBookOnReturn = (book,callback)=> {
    Book.findOneAndUpdate({isbn:book.isbn},{$inc:{no_of_borrowed_copies:-1,no_of_available_copies:+1},$set:{copies:book.copies}},callback);
};

// find a book
module.exports.findBook = (book,callback)=> {
    Book.findOne({isbn:book.isbn},callback);
};

// delete a book
module.exports.deleteBook = (book,callback)=> {
    Book.findOneAndRemove({isbn:book.isbn},callback);
};

// update cancelled reservation
module.exports.changeBookCopyStatus = (book,callback)=> {
   Book.findOneAndUpdate({isbn:book.isbn},{$inc:{no_of_available_copies:+1,no_of_reserved_copies:-1},$set:{copies:book.copies}},callback);
};

// update new book copies
module.exports.updateBookCopy = (book,callback)=> {
    Book.findOneAndUpdate({isbn:book.isbn},{$set:{copies:book.copies,no_of_available_copies:book.no_of_available_copies, no_of_copies:book.no_of_copies}},callback);
};