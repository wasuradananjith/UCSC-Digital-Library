const express = require('express');
const app = express();

const port = process.env.PORT || 3000; // whatever is in the environment variable PORT, or 3000

app.get("/",(req,res)=>{
    res.send("UCSC Library");
});

app.listen(port,()=> {
    console.log("listening to port "+port);
});