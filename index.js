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

app.use(express.json());

var permitCrossDomainRequests = function(req, res, next) {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', '*');
    res.header('Access-Control-Allow-Headers', '*');
    // some browsers send a pre-flight OPTIONS request to check if CORS is enabled so you have to also respond to that
    if ('OPTIONS' === req.method) {
      res.send(200);
    }
    else {
      next();
    }
};

app.use(permitCrossDomainRequests);

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