const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000; // whatever is in the environment variable PORT, or 3000
const user = require('./routes/users');

app.use(express.static(path.join(__dirname,"public"))); // front-end is in public folder

app.use('/user',user);

app.get("/",(req,res)=>{
    res.send("UCSC Library");
});

app.listen(port,()=> {
    console.log("listening to port "+port);
});