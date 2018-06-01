const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const User = require('../models/user');
const Copy = require('../models/copy');
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

module.exports = router;