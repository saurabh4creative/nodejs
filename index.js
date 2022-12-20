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

app.use(cors({
    origin: '*'
}));

app.use(function (req, res, next) {
    res.setHeader('Access-Control-Allow-Origin', 'http://localhost:3000');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    res.setHeader('Access-Control-Allow-Credentials', true);
    next();
});

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