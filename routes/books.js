const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const User = require('../models/user');;
const Copy = require('../models/copy');
const Borrow = require('../models/borrow');
const Return = require('../models/returnbook');
const Reservation = require('../models/reservation');
const nodemailer = require('nodemailer');
const twilio = require('twilio');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'ucscdigitallibrary@gmail.com',
        pass: 'ucsc@123'
    }
});

const accountSid = 'AC2dd8510e1050de86a5e2401fbb4247fc'; // Your Account SID from www.twilio.com/console
const authToken = '3097178934fd53ce73af0d332611db8b';   // Your Auth Token from www.twilio.com/console
const client = new twilio(accountSid, authToken);

router.get("",(req,res)=>{
    res.send("Hello Books");
});

// route to add a new book
router.post("/add",(req,res)=>{

    let today = new Date();
    let fullYear = today.getFullYear();
    let fullMonth = today.getMonth()+1;
    let fullDate = today.getDate();
    if (fullMonth<10){
        fullMonth='0'+fullMonth;
    }
    if(fullDate<10){
        fullDate='0'+fullDate;
    }
    let date = fullYear+'/'+fullMonth+'/'+fullDate;

    let hours = today.getHours();
    let minutes = today.getMinutes();
    let seconds = today.getSeconds();

    if (hours<10){
        hours='0'+hours;
    }
    if (minutes<10){
        minutes='0'+minutes;
    }
    if (seconds<10){
        seconds='0'+seconds;
    }
    let time = hours + ":" + minutes + ":" + seconds;
    let dateTime = date+' ' + time;

    const newBook = new Book({
        isbn:req.body.isbn,
        title:req.body.title,
        author:req.body.author,
        subject:req.body.subject,
        no_of_copies:req.body.no_of_copies,
        no_of_available_copies:req.body.no_of_copies,
        no_of_borrowed_copies:0,
        no_of_reserved_copies:0,
        copies:[]
    });

    let count = 1;
    while(count<=newBook.no_of_copies){
        let newCopy = new Copy({
            isbn:req.body.isbn,
            availability:"Available",
            date_added:dateTime,
            last_borrowed_date:null
        });
        newBook.copies.push(newCopy);
        count++;
    }

    Book.findByISBN(newBook.isbn,(err,book)=>{
        // if book is not in database
        if(!book){

            // Add book to the database
            Book.saveBook(newBook,(err,book)=> {
                if(err){
                    res.json({state:false,msg:"Failed to Add the Book"});
                }
                if(book){
                    res.json({state:true,msg:"Book Successfully Added!"});

                    // get all student details and send emails
                    User.getAllStudentUserDetails((err,students)=> {
                        if(err){
                            res.json({state:false,msg:"Failed to retrieve student details"});
                        }
                        if(students){
                            for (let student in students) {
                                // send emails to all the student users
                                const mailOptions = {
                                    from: 'ucscdigitallibrary@ucsc.cmb.ac.lk',
                                    to: students[student].email,
                                    subject: 'New Book is Added',
                                    html: '<h1>Hi, '+students[student].name+'</h1>' +
                                    '<p style="text-align: left;">A new book has been added just now. Details are given below.</p>\n' +
                                    '<ul style="text-align: left;">\n' +
                                    '<li><strong>ISBN :</strong>'+req.body.isbn+'</li>\n' +
                                    '<li><strong>Title :</strong>'+req.body.title+'</li>\n' +
                                    '<li><strong>Author :</strong>'+req.body.author+'</li>\n' +
                                    '<li><strong>Subject :</strong>'+req.body.subject+'</li>\n' +
                                    '</ul>\n' +
                                    '<p style="text-align: left;">'+req.body.no_of_copies+' copies is/are available. Hurry now, reserve your one too.</p>\n' +
                                    '<p style="text-align: left;">&nbsp;</p>\n' +
                                    '<p style="text-align: left;">Regards,</p>\n' +
                                    '<p style="text-align: left;">UCSC Digital Library</p>'
                                };

                                transporter.sendMail(mailOptions, function(error, info){
                                    if (error) {
                                        console.log(error);
                                    } else {
                                        console.log('Email sent: ' + info.response);
                                    }
                                });

                                let phoneNo = students[student].phone;
                                // send SMS
                                client.messages.create({
                                    body: 'New Book Added! ISBN: '+req.body.isbn+', '+req.body.no_of_copies+' copies is/are available. Reserve your one!',
                                    to: '+94'+phoneNo.substring(1, phoneNo.length),  // Text this number
                                    from: '+19792436762' // From a valid Twilio number
                                });
                            }
                        }
                    });
                }
            });
        }
        // if an existing book
        if (book){
            res.json({state:false,msg:"Book already exists in the database"});
        }
        // if error
        if (err){
            res.json({state:false,msg:"Failed to Add the Book"});
        }
    });
});

// route to get all the book details
router.post("/get-all",(req,res)=>{
    Book.getAllBooks((error,books)=>{
       if (books){
           res.json({state:true,msg:books});
       }
        if (error || !books){
            res.json({state:false,msg:[]});
        }
    });
});

// route to filter/search book details
router.post("/search",(req,res)=>{
    const searchText = req.body.enteredText;
    Book.getFilteredBooks(searchText,(error,books)=>{
        if (books){
            res.json({state:true,msg:books});
        }
        if (error || !books){
            res.json({state:false,msg:[]});
        }
    });
});


// route to get borrow count for a particular user
router.post("/borrow-count",(req,res)=>{
    const email = req.body.email;
    Borrow.getCount(email,(error,count)=>{
        if (count){
            res.json({state:true,msg:count});
        }
        if (error || !count){
            res.json({state:false,msg:[]});
        }
    });
});

// route to borrow a book
router.post("/borrow",(req,res)=>{

    let student_email = req.body.student.email;
    let book_isbn = req.body.book.isbn;

    Reservation.checkSimilarReservations({email:student_email, isbn:book_isbn},(error,isReserved)=>{
        if (isReserved!=""){
            res.json({state:false,msg:"You have already reserved a copy of this book!"});
        }
        if (error){
            res.json({state:false,msg:"Failed to borrow"});
        }
        // not borrowing a the same reserved book twice
        if (isReserved==""){
            // check whether the student is borrowing the same book twice
            Borrow.checkSimilarBooks({email:student_email, isbn: book_isbn},(error,foundSimilar)=>{
                if (foundSimilar!=""){
                    res.json({state:false,msg:req.body.student.name+" have already borrowed this book!"});
                }
                if (error){
                    res.json({state:false,msg:"Failed to borrow"});
                }
                // not borrowing the same book twice
                if (foundSimilar==""){
                    let selectedCopy;

                    // get today date
                    let today = new Date();
                    let fullYear = today.getFullYear();
                    let fullMonth = today.getMonth()+1;
                    let fullDate = today.getDate();

                    // set borrowed date
                    let dateBorrowed = fullYear+'/'+fullMonth+'/'+fullDate;

                    // set the date to return the book
                    today.setDate(today.getDate()+7);
                    let dateToReturn = today.getFullYear()+'/'+ (today.getMonth()+1) +'/'+today.getDate();

                    for (i = 0; i < req.body.book.copies.length; i++) {
                        if (req.body.book.copies[i].availability=="Available"){
                            req.body.book.copies[i].availability="Borrowed";
                            req.body.book.copies[i].last_borrowed_date = dateBorrowed;
                            selectedCopy= req.body.book.copies[i];
                            break;
                        }
                    }

                    const newBorrow =  new Borrow({
                        email:req.body.student.email,
                        student:req.body.student,
                        isbn:req.body.book.isbn,
                        title:req.body.book.title,
                        author:req.body.book.author,
                        subject:req.body.book.subject,
                        borrowed_date:dateBorrowed,
                        return_date:dateToReturn,
                        fine:null,
                        copy:selectedCopy
                    });

                    // add new record to the borrows
                    Borrow.saveBorrow(newBorrow,(error,borrow)=>{
                        if (borrow){
                            let returnedBook = req.body.book;
                            // update the book
                            Book.updateBook(returnedBook,(error,bookUpdate)=>{
                                if (bookUpdate){
                                    res.json({state:true,msg:"Borrow Successful!"});
                                }
                                if (error || !bookUpdate){
                                    res.json({state:false,msg:"Failed to borrow"});
                                }
                            });

                        }
                        if (error || !borrow){
                            res.json({state:false,msg:"Failed to borrow"});
                        }
                    });
                }
            });
        }
    });
});

// route to get all borrow details
router.post("/get-borrows",(req,res)=>{
    Borrow.getAllBorrows((error,borrow)=>{
        if (borrow){
            res.json({state:true,msg:borrow});
        }
        if (error || !borrow){
            res.json({state:false,msg:[]});
        }
    });
});

// route to update the fines
router.post("/borrow-fine",(req,res)=>{
    let borrow = req.body;
    Borrow.updateBorrow(borrow,(error,borrow)=>{
        if (borrow){
            res.json({state:true,msg:borrow});
        }
        if (error || !borrow){
            res.json({state:false,msg:[]});
        }
    });
});

// route to filter/search borrow details
router.post("/borrow-search",(req,res)=>{
    const searchText = req.body.enteredText;
    Borrow.searchBorrow(searchText,(error,books)=>{
        if (books){
            res.json({state:true,msg:books});
        }
        if (error || !books){
            res.json({state:false,msg:[]});
        }
    });
});

// route to filter/search borrow details
router.post("/return",(req,res)=>{

    // get today date
    let today = new Date();
    let fullYear = today.getFullYear();
    let fullMonth = today.getMonth()+1;
    let fullDate = today.getDate();

    // set returned date
    let dateReturned = fullYear+'/'+fullMonth+'/'+fullDate;

    req.body.copy.availability="Available";

    const newReturn =  new Return({
        email:req.body.email,
        student:req.body.student,
        isbn:req.body.isbn,
        title:req.body.title,
        author:req.body.author,
        subject:req.body.subject,
        borrowed_date:req.body.borrowed_date,
        returned_date:dateReturned,
        fine:req.body.fine,
        copy:req.body.copy
    });

    // add new record to the borrows
    Return.saveReturn(newReturn,(error,returnedBorrowed)=>{
        if (returnedBorrowed){

            // get the book details to update the status
            Book.findByISBN(req.body.isbn,(error,book)=>{
                if (book){
                    let returnedBook = book;
                    for (i = 0; i < returnedBook.copies.length; i++) {
                        if (returnedBook.copies[i]._id==req.body.copy._id){
                            returnedBook.copies[i].availability="Available";
                            break;
                        }
                    }

                    // update the book
                    Book.updateBookOnReturn(returnedBook,(error,bookUpdate)=>{
                        if (bookUpdate){
                            Borrow.deleteBorrow(req.body,(error,deleteBorrow)=>{
                                if(deleteBorrow){
                                    res.json({state:true,msg:"Book Returned Successfully!"});
                                }
                                if(error || !deleteBorrow){
                                    res.json({state:false,msg:"Failed to return the book"});
                                }
                            });
                        }
                        if (error || !bookUpdate){
                            res.json({state:false,msg:"Failed to return the book"});
                        }
                    });
                }
                if (!book || error){
                    res.json({state:false,msg:"Failed to return the book"});
                }
            });

        }
        if (error || !returnedBorrowed){
            res.json({state:false,msg:"Failed to return the book"});
        }
    });
});

// route to filter/search returned books details
router.post("/return-search",(req,res)=>{
    const searchText = req.body.enteredText;
    Return.searchReturnedBooks(searchText,(error,books)=>{
        if (books){
            res.json({state:true,msg:books});
        }
        if (error || !books){
            res.json({state:false,msg:[]});
        }
    });
});

// route to filter/search returned books details for a particular student
router.post("/return-search-student",(req,res)=>{
    Return.searchReturnedBooksByStudent(req.body,(error,books)=>{
        if (books){
            res.json({state:true,msg:books});
        }
        if (error || !books){
            res.json({state:false,msg:[]});
        }
    });
});

// route to edit book copy
router.post("/edit",(req,res)=>{
    let editBook = req.body;
    let difference = Math.abs(editBook.oldNumberOfCopies - editBook.book.no_of_copies);
    if (editBook.book.no_of_copies>editBook.oldNumberOfCopies){

        let today = new Date();
        let fullYear = today.getFullYear();
        let fullMonth = today.getMonth()+1;
        let fullDate = today.getDate();
        if (fullMonth<10){
            fullMonth='0'+fullMonth;
        }
        if(fullDate<10){
            fullDate='0'+fullDate;
        }
        let date = fullYear+'/'+fullMonth+'/'+fullDate;

        let hours = today.getHours();
        let minutes = today.getMinutes();
        let seconds = today.getSeconds();

        if (hours<10){
            hours='0'+hours;
        }
        if (minutes<10){
            minutes='0'+minutes;
        }
        if (seconds<10){
            seconds='0'+seconds;
        }
        let time = hours + ":" + minutes + ":" + seconds;
        let dateTime = date+' ' + time;

        // add copies
        let count = 1;
        while(count<=difference){
            let newCopy = new Copy({
                isbn:editBook.book.isbn,
                availability:"Available",
                date_added:dateTime,
                last_borrowed_date:null
            });
            editBook.book.copies.push(newCopy);
            count++;
        }
        editBook.book.no_of_available_copies = editBook.book.no_of_available_copies + difference;
    }
    else{
        // delete copies
        let count = 0;
        let differenceAcheived = 0;
        while(count<editBook.oldNumberOfCopies){
            if (difference==differenceAcheived){
                break;
            }
            else{
                if (editBook.book.copies[count].availability=="Available"){
                    editBook.book.copies.splice(count,1);
                    differenceAcheived++;
                }
            }
            count++;
        }
        editBook.book.no_of_available_copies = editBook.book.no_of_available_copies - difference;

    }
    // update the copy to database
    Book.updateBookCopy(editBook.book,(err,book)=> {
        if(err){
            res.json({state:false,msg:"Failed to Add the Copies"});
        }
        if(book){
            res.json({state:true,msg:"Copies Successfully Updated!"});
        }
    });
});

// route to delete a book
router.post("/delete",(req,res)=>{
    Book.deleteBook(req.body,(error,book)=>{
        if (book){
            res.json({state:true,msg:"Book has been deleted successfully!"});
        }
        if (error || !book){
            res.json({state:false,msg:"Failed to delete the book!"});
        }
    });
});

// route to filter/search old overdue
router.post("/old-overdue",(req,res)=>{
    Return.searchOldOverdue((error,books)=>{
        if (books){
            res.json({state:true,msg:books});
        }
        if (error || !books){
            res.json({state:false,msg:[]});
        }
    });
});

module.exports = router;