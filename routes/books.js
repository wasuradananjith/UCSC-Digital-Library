const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const User = require('../models/user');
const Copy = require('../models/copy');
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
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;

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
            console.log(books);
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
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' ' + time;

    let isbn = copies[0].isbn; // to be inserted into the reservations collection
    let selectedCopy=null; // to be inserted into the reservations collection

    for (i = 0; i < copies.length; i++) {
        if (copies[i].availability=="Available"){
            copies[i].availability="Reserved";
            copies[i].last_borrowed_date = dateTime;
            selectedCopy= copies[i];
            break;
        }
    }

    const newReservation =  new Reservation({
        email:req.body.email,
        isbn:req.body.isbn,
        title:req.body.title,
        author:req.body.isbn,
        subject:req.body.subject,
        copy:selectedCopy
    });

    Book.reserveBookCopy(copies,(error,book)=>{
        if (book){
            console.log("Book Copy Status Updated");
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
                res.json({state:false,msg:"Fail to cancel the reservation"});
            }
        });


});


// route to add a new book
router.post("/suggestion-add",(req,res)=>{

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;

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

module.exports = router;