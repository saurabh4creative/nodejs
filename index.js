const dotenv  = require('dotenv');
dotenv.config();
const express = require('express');
const cors    = require('cors'); 
const app     = express();

var allowCrossDomain = function(req, res, next) {
res.header("Access-Control-Allow-Origin", "*"); // allow requests from any other server
res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE'); // allow these verbs
res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Cache-Control");
     
app.use(allowCrossDomain); // plumbing it in as middleware



const PORT    = 8080 || process.env.PORT;
const connDB  = require('./_config/db'); 
const userRoutes = require('./_routes/userRoute');
const projectRoutes = require('./_routes/projectRoute');
const ticketRoutes = require('./_routes/ticketRoute');



connDB();

app.use(express.json());

app.use("/api/v1/users", userRoutes);
app.use("/api/v1/projects", projectRoutes);
app.use("/api/v1/tickets", ticketRoutes);

app.get('/', (req, res)=>{
    res.json({
         status : true,
         message : 'Api Call Working New' 
    })
})

app.listen(PORT, ()=>{
    console.log(`Server Running at PORT s ${PORT}`);
})