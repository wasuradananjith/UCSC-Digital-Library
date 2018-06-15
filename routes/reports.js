const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const config = require('../config/database');
const PDFDocument = require ('pdfkit');
const fs = require('fs');
const blobStream  = require ('blob-stream');

router.get("",(req,res)=>{

});

// route to get all the book details
router.post("/get-all",(req,res)=>{
    /*Book.getAllBooks((error,books)=>{
       if (books){
           res.json({state:true,msg:books});
       }
        if (error || !books){
            res.json({state:false,msg:[]});
        }
    });*/
});

// route to filter/search book details
router.post("/search",(req,res)=>{
    const searchText = req.body.enteredTextStudent;
    console.log(req.body.enteredText);
    Student.getFilteredStudents(searchText,(error,students)=>{
        if (students){
            res.json({state:true,msg:students});
        }
        if (error || !students){
            res.json({state:false,msg:[]});
        }
    });
});

module.exports = router;