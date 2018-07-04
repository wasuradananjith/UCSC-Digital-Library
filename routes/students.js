const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const config = require('../config/database');

router.get("",(req,res)=>{
    res.send("Hello Students");
});

// route to filter/search student details
router.post("/search",(req,res)=>{
    const searchText = req.body.enteredTextStudent;
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