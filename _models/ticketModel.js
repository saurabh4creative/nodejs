const mongoose = require('mongoose'); 

const ticketSchema = mongoose.Schema({
    title:{
        type : String,
        required : true
    },
    discription:{
        type : String,
        required : true
    }, 
    priority:{
        type : String,
        required : true, 
    },
    type:{
        type : String,
        required : true, 
    },
    estimate:{
        type : String,
        required : false, 
    },
    points:{
        type : Number,
        default : 0,
        required : false, 
    },
    status:{
        type : String,
        required : false,
        default : 'Backlog' 
    },
    project : {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref : 'Project' 
    },
    reportar : {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref : 'User' 
    },
    assignee : {
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref : 'User' 
    },
    board : [{
        type: mongoose.Schema.Types.ObjectId,
        required: false,
        ref : 'Karbon' 
    }],
    comments : { required: false, type: [{
        date:     { 
            type: Date, 
            default: Date.now,
            required: false, 
        },
        userId:   { 
            type: mongoose.Schema.Types.ObjectId,
            required: false,
            ref : 'User'     
        },
        content:  { type: Object, required: false }
    }]} 
},{
    timestamps:true
})

const Ticket = mongoose.model('Ticket', ticketSchema);

module.exports = Ticket;