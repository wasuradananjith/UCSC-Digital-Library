const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const passport = require('passport');
const cors = require('cors');

const mongoose = require('mongoose');
const app = express();
const port = process.env.PORT || 3000; // whatever is in the environment variable PORT, or 3000

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
app.use(cors());
require('./config/passport')(passport);

const config = require('./config/database');
const user = require('./routes/users');
const book = require('./routes/books');
const reservation = require('./routes/reservations');
const student = require('./routes/students');
const report = require('./routes/reports');
const suggestion = require('./routes/suggestions');

const connection = mongoose.connect(config.database);
if(connection){
    console.log("database connected");
}
else{
    console.log("database not connected");
}


app.use(express.static(path.join(__dirname,"public"))); // front-end is in public folder

app.use('/user',user);
app.use('/book',book);
app.use('/reservation',reservation);
app.use('/student',student);
app.use('/report',report);
app.use('/suggestion',suggestion);

app.get("/",(req,res)=>{
    res.send("UCSC Library");
});

app.listen(port,()=> {
    console.log("listening to port "+port);
});