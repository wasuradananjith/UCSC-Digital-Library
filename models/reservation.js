const mongoose = require('mongoose');
const schema = mongoose.Schema;

const reservationSchema = new schema({
    email:{type:String},
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

// get reservations of a particular user
module.exports.getStudentReservations = (email,callback)=>{
    Reservation.find({email:email},callback);
};
