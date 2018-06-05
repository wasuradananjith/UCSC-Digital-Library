const mongoose = require('mongoose');
const schema = mongoose.Schema;

const reservationSchema = new schema({
    email:{type:String},
    student:{type:Object},
    isbn:{type:String},
    title:{type:String},
    author:{type:String},
    subject:{type:String},
    copy:{type:Object}
});

const Reservation = module.exports = mongoose.model("Reservation",reservationSchema);

// save a new reservation
module.exports.saveReservation = (newReservation,callback)=>{
    newReservation.save(callback);
};

// get reservation count for a particular user
module.exports.getCount = (email,callback)=>{
    Reservation.count({email:email},callback);
};

// get total reservation count
module.exports.getTotalCount = (callback)=>{
    Reservation.count({},callback);
};

// get reservations of a particular user
module.exports.getStudentReservations = (email,callback)=>{
    Reservation.find({email:email},callback);
};

// get reservations of a particular user
module.exports.getAdminReservations = (callback)=>{
    Reservation.find({},callback);
};

// delete a reservation
module.exports.deleteReservation = (book,callback)=>{
    Reservation.findOneAndDelete({_id:book._id},callback);
};

// fetch all the reservations
module.exports.getFilteredReservations = (searchText,callback)=> {
    let text = "/"+searchText+"/i";
    Reservation.find({$or:[{title: new RegExp(searchText, "i")},
            {isbn: new RegExp(searchText, "i")},
            {author: new RegExp(searchText, "i")},
            {subject: new RegExp(searchText, "i")},
            {email: new RegExp(searchText, "i")},
            {"student.reg_no": new RegExp(searchText, "i")},
            {"student.index_no": new RegExp(searchText, "i")},
            {"student.name": new RegExp(searchText, "i")},
            {"student.phone": new RegExp(searchText, "i")},
            {"student.address": new RegExp(searchText, "i")},
            {"student.nic": new RegExp(searchText, "i")}
        ]}, callback).sort({ title: 1 });
};