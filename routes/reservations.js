const express = require('express');
const router = express.Router();
const Student = require('../models/student');
const Book = require('../models/book');
const Borrow = require('../models/borrow');
const Reservation = require('../models/reservation');

router.get("",(req,res)=>{
    res.send("Hello Reservations");
});

// route to reserve a book copy
router.post("/add",(req,res)=>{

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

// route to get total reservations count
router.post("/total",(req,res)=>{
    Reservation.getTotalCount((error,count)=>{
        if (count){
            res.json({state:true,msg:count});
        }
        if (error || !count){
            res.json({state:false,msg:"0"});
        }
    });
});


// route to get reservation count for a particular user
router.post("/user-count",(req,res)=>{
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


// route to  get the reservations for a particular student
router.post("/student",(req,res)=>{
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

// route to  get the reservations for admin
router.post("/admin",(req,res)=>{
    Reservation.getAdminReservations((error,reservations)=>{
        if (reservations){
            res.json({state:true,msg:reservations});
        }
        if (error || !reservations){
            res.json({state:false,msg:[]});
        }
    });
});

// route to cancel a reservation
router.post("/cancel",(req,res)=>{
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


// route to filter/search reservation details
router.post("/search",(req,res)=>{
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
router.post("/borrow",(req,res)=>{

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
                    Book.updateBookOnReserveBorrow(returnedBook,(error,bookUpdate)=>{
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

module.exports = router;