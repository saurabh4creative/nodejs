const dotenv  = require('dotenv');
dotenv.config();
const express = require('express');
const cors    = require('cors'); 
const app     = express();
const PORT    = 8080 || process.env.PORT;
const connDB  = require('./_config/db'); 
const userRoutes = require('./_routes/userRoute');
const projectRoutes = require('./_routes/projectRoute');
const ticketRoutes = require('./_routes/ticketRoute');

connDB();

app.use(express.methodOverride());

// ## CORS middleware
// 
var allowCrossDomain = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET,PUT,POST,DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
      
    // intercept OPTIONS method
    if ('OPTIONS' == req.method) {
      res.send(200);
    }
    else {
      next();
    }
};
app.use(allowCrossDomain);

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