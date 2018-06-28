const express = require('express');
const router = express.Router();
const Suggestion = require('../models/booksuggestion');
const Book = require('../models/book');

router.get("",(req,res)=>{
    res.send("Hello Suggestions");
});


// route to get total suggestions count
router.post("/total",(req,res)=>{
    Suggestion.getTotalCount((error,count)=>{
        if (count){
            res.json({state:true,msg:count});
        }
        if (error || !count){
            res.json({state:false,msg:"0"});
        }
    });
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

// route to filter/search suggestion details
router.post("/search",(req,res)=>{
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


// route to discard a suggestion
router.post("/dismiss",(req,res)=>{
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

module.exports = router;