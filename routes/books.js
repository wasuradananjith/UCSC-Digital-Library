const express = require('express');
const router = express.Router();
const Book = require('../models/book');
const Copy = require('../models/copy');
const Email = require('../models/email');

const config = require('../config/database');

router.get("",(req,res)=>{
    res.send("Hello Books");
});

router.post("/add",(req,res)=>{

    let today = new Date();
    let date = today.getFullYear()+'-'+(today.getMonth()+1)+'-'+today.getDate();
    let time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
    let dateTime = date+' '+time;

    const newBook = new Book({
        isbn:req.body.isbn,
        title:req.body.title,
        author:req.body.author,
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

                    // send an email
                    const mailOptions = {
                        from: 'ucscdigitallibrary@ucsc.cmb.ac.lk',
                        to: 'wasuradananjith@gmail.com',
                        subject: 'Sending Email using Node.js',
                        text: 'That was easy!'
                    };

                    Email.transporter.sendMail(mailOptions, function(error, info){
                        if (error) {
                            console.log(error);
                        } else {
                            console.log('Email sent: ' + info.response);
                        }
                    });
                }
            });
        }
        // if an existing book
        if (book){
            res.json({state:false,msg:"Book is already exists in the database"});
        }
        // if error
        if (err){
            res.json({state:false,msg:"Failed to Add the Book"});
        }
    });
});

module.exports = router;