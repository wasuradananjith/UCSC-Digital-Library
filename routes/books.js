const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const User = require('../models/user');
const Student = require('../models/student');
const Copy = require('../models/copy');
const Borrow = require('../models/borrow');
const Return = require('../models/returnbook');
const Suggestion = require('../models/booksuggestion');
const Reservation = require('../models/reservation');
const nodemailer = require('nodemailer');
const config = require('../config/database');

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'aweerateamscorp2@gmail.com',
        pass: 'aweera123'
    }
});

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

// route to reserve a book copy
router.post("/reserve",(req,res)=>{

    let copies = req.body.copies;

    // get today date
    let today = new Date();
    let fullYear = today.getFullYear();
    let fullMonth = today.getMonth()+1;
    let fullDate = today.getDate();

    // set reserved date
    let dateReserved = fullYear+'/'+fullMonth+'/'+fullDate;

    // set the date to return the book
    today.setDate(today.getDate()+7);

    let isbn = copies[0].isbn; // to be inserted into the reservations collection
    let selectedCopy=null; // to be inserted into the reservations collection

    for (i = 0; i < copies.length; i++) {
        if (copies[i].availability=="Available"){
            copies[i].availability="Reserved";
            copies[i].last_borrowed_date = dateReserved;
            selectedCopy= copies[i];
            break;
        }
    }

    Student.findByEmail(req.body.email,(error,student)=>{
        if (student){
            const newReservation =  new Reservation({
                email:req.body.email,
                student:student,
                isbn:req.body.isbn,
                title:req.body.title,
                author:req.body.author,
                subject:req.body.subject,
                copy:selectedCopy
            });

            Book.reserveBookCopy(copies,(error,book)=>{
                if (book){
                    Reservation.saveReservation(newReservation,(error,reservation)=>{
                        if(reservation){
                            res.json({state:true,msg:"Your reservation is successful!"});
                        }
                        if (error || !reservation){
                            res.json({state:false,msg:"Failed to reserve the book"});
                        }
                    });
                }
                if (error || !book){
                    res.json({state:false,msg:"Failed to reserve the book"});
                }
            });
        }
        if(error || !student){
            res.json({state:false,msg:"Failed to reserve the book"});
        }
    });


});


// route to get reservation count for a particular user
router.post("/reservation-count",(req,res)=>{
    const email = req.body.email;
    Reservation.getCount(email,(error,count)=>{
        if (count){
            res.json({state:true,msg:count});
        }
        if (error || !count){
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

// route to get total reservations count
router.post("/reservation-total",(req,res)=>{
    Reservation.getTotalCount((error,count)=>{
        if (count){
            res.json({state:true,msg:count});
        }
        if (error || !count){
            res.json({state:false,msg:"0"});
        }
    });
});

// route to get total suggestions count
router.post("/suggestion-total",(req,res)=>{
    Suggestion.getTotalCount((error,count)=>{
        if (count){
            res.json({state:true,msg:count});
        }
        if (error || !count){
            res.json({state:false,msg:"0"});
        }
    });
});


// route to  get the reservations for a particular student
router.post("/reservations-student",(req,res)=>{
    const email = req.body.email;
    Reservation.getStudentReservations(email,(error,reservations)=>{
        if (reservations){
            res.json({state:true,msg:reservations});
        }
        if (error || !reservations){
            res.json({state:false,msg:[]});
        }
    });
});

// route to cancel a reservation
router.post("/reserve-cancel",(req,res)=>{
    const currentBook = req.body;
        Reservation.deleteReservation(currentBook,(error,reservations)=>{
            if (reservations){
                Book.findBook(currentBook,(error,reservedBook)=>{
                    if(reservedBook){
                        let reservedBookCopy = reservedBook;
                        for (i = 0; i < reservedBookCopy.copies.length; i++) {
                            if(reservedBookCopy.copies[i]._id==currentBook.copy._id){
                                reservedBookCopy.copies[i].availability="Available";
                                break;
                            }
                        }
                        //console.log(reservedBook);
                        Book.changeBookCopyStatus(reservedBookCopy,(error,cancellation)=>{
                            if(cancellation){
                                res.json({state:true,msg:"Reservation is cancelled successfully"});
                            }
                            if(error || !cancellation){
                                res.json({state:false,msg:"Fail to cancel the reservation"});
                            }
                        });
                    }
                    if (error || !reservedBook){
                        res.json({state:false,msg:"Fail to cancel the reservation"});
                    }
                });
            }
            if (error || !reservations){
                console.log("Hello");
                res.json({state:false,msg:"Fail to cancel the reservation"});
            }
        });


});


// route to add a new book
router.post("/suggestion-add",(req,res)=>{

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

    const newSuggestion = new Suggestion({
        isbn:req.body.isbn,
        title:req.body.title,
        author:req.body.author,
        subject:req.body.subject,
        date_added:dateTime,
        student_email:req.body.email
    });

    Book.findByISBN(newSuggestion.isbn,(err,book)=>{
        // if book is not in database
        if(!book){

            // Add book to the database
            Suggestion.saveSuggestion(newSuggestion,(err,book)=> {
                if(err){
                    res.json({state:false,msg:"Failed to Add the Book"});
                }
                if(book){
                    res.json({state:true,msg:"Thank you! Your Suggestion is Successfully Recorded"});
                }
            });
        }
        // if an existing book
        if (book){
            res.json({state:false,msg:"Book already exists in the database"});
        }
        // if error
        if (err){
            res.json({state:false,msg:"Failed to Add your Suggestion"});
        }
    });
});

// route to  get the reservations for a particular student
router.post("/reservations-admin",(req,res)=>{
    Reservation.getAdminReservations((error,reservations)=>{
        if (reservations){
            res.json({state:true,msg:reservations});
        }
        if (error || !reservations){
            res.json({state:false,msg:[]});
        }
    });
});

// route to filter/search reservation details
router.post("/reservation-search",(req,res)=>{
    const searchText = req.body.enteredText;
    Reservation.getFilteredReservations(searchText,(error,books)=>{
        if (books){
            res.json({state:true,msg:books});
        }
        if (error || !books){
            res.json({state:false,msg:[]});
        }
    });
});

// route to borrow a reserved book
router.post("/reserve-borrow",(req,res)=>{

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

    req.body.copy.availability="Borrowed";
    req.body.copy.last_borrowed_date=dateBorrowed;

    const newBorrow =  new Borrow({
        email:req.body.email,
        student:req.body.student,
        isbn:req.body.isbn,
        title:req.body.title,
        author:req.body.author,
        subject:req.body.subject,
        borrowed_date:dateBorrowed,
        borrowed_time:dateBorrowed,
        return_date:dateToReturn,
        fine:null,
        copy:req.body.copy
    });

    // add new record to the borrows
    Borrow.saveBorrow(newBorrow,(error,borrow)=>{
        if (borrow){

            // get the book details to update the status
            Book.findByISBN(req.body.isbn,(error,book)=>{
               if (book){
                   let returnedBook = book;
                   for (i = 0; i < returnedBook.copies.length; i++) {
                       if (returnedBook.copies[i]._id==req.body.copy._id){
                           returnedBook.copies[i].availability="Borrowed";
                           returnedBook.copies[i].last_borrowed_date = dateBorrowed;
                           break;
                       }
                   }

                   // update the book
                   Book.updateBook(returnedBook,(error,bookUpdate)=>{
                       if (bookUpdate){
                           Reservation.deleteReservation(req.body,(error,reservationCancel)=>{
                               if(reservationCancel){
                                   res.json({state:true,msg:"Borrow Successful!"});
                               }
                               if(error || !reservationCancel){
                                   res.json({state:false,msg:"Failed to borrow"});
                               }
                           });
                       }
                       if (error || !bookUpdate){
                           res.json({state:false,msg:"Failed to borrow"});
                       }
                   });
               }
               if (!book || error){
                   res.json({state:false,msg:"Failed to borrow"});
               }
            });

        }
        if (error || !borrow){
            res.json({state:false,msg:"Failed to borrow"});
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
                    res.json({state:false,msg:"You have already borrowed this book!"});
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

// route to filter/search suggestion details
router.post("/suggestion-search",(req,res)=>{
    const searchText = req.body.enteredText;
    Suggestion.getFilteredSuggestions(searchText,(error,books)=>{
        if (books){
            res.json({state:true,msg:books});
        }
        if (error || !books){
            res.json({state:false,msg:[]});
        }
    });
});

// route to cancel a reservation
router.post("/suggestion-dismiss",(req,res)=>{
    const currentBook = req.body;
    Suggestion.deleteSuggestion(currentBook,(error,suggestion)=>{
        if (suggestion){
            res.json({state:true,msg:"Suggestion Deleted"});
        }
        if (error || !suggestion){
            res.json({state:false,msg:"Fail to delete the suggestion"});
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
            console.log(borrow);
            res.json({state:true,msg:borrow});
        }
        if (error || !borrow){
            console.log(borrow);
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

module.exports = router;