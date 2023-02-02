const User = require('../_models/userModel');
const Project = require('../_models/projectModel');
const Ticket = require('../_models/ticketModel');
var mongoose = require('mongoose');

const get_Data = async (req, res) => {
     const user = await User.find({});
     const project = await Project.find({});

     res.json({
          status : true,
          message : 'Data Fetch Successfully',
          users : user,
          projects : project
     })
}

const create_create = async (req, res) => { 
     const { assignee, discription, priority, project, reportar, title, type, estimate } = req.body;
     const { _id } = req.user;

     const comments = {
          userId : _id,
          content : ['created the Issue']
     };

     const ticket = await Ticket.create({ assignee, discription, priority, project, reportar, title, type, estimate, comments});
     
     if( ticket ){
          res.json({
               status : true,
               message : 'Ticket Create Successfully...',
               data : ticket
          })
     } 
     else{
          res.json({
               status : false,
               message : 'Error in Creation',
          })
     }
}

const get_all = async (req, res) => {
     const ticket = await Ticket.find({}).populate('project').populate('assignee').populate('reportar').populate('board').sort({createdAt:-1});

     res.json({
          status  : true,
          messgae : 'Ticket Fetch Successfully',
          tickets : ticket
     })
}

const my_tickets = async (req, res) => {
     const u_id  = req.user._id;
     
     const ticketReportar = await Ticket.find({ reportar : u_id }).populate('project').populate('assignee').populate('reportar').sort({createdAt:-1});

     res.json({
          status  : true,
          message : 'Tickets Fetched Successfully', 
          tickets : ticketReportar
     })
}

const assign_tickets = async (req, res) => {
     const u_id  = req.user._id;
     
     const ticketAssign   = await Ticket.find({ assignee : u_id }).populate('project').populate('assignee').populate('reportar').sort({createdAt:-1});
     
     res.json({
          status  : true,
          message : 'Tickets Fetched Successfully', 
          tickets : ticketAssign
     })
}

const get_ticket = async ( req, res ) => {
     const id = req.params.id;
     

     if( id ){
          try{
               const ticket = await Ticket.findById(id).populate('project').populate('assignee').populate('reportar').populate('board').populate('comments.userId'); 

               if( ticket ){
                    res.json({
                         status  : true,
                         message : 'Ticket Details',
                         ticket  : ticket
                    })
               }
               else{
                    res.json({
                         status  : false,
                         message : 'No Ticket Found', 
                         ticket  : {}
                    })
               }

          }catch(err){
               res.json({
                    status : 'error',
                    message : 'Something Wrong with Ticket ID or May be not matched...',  
                    ticket  : {},
                    error : err.message
               }) 
          }
     }
     else{
          res.json({
                status : false,
                message : 'Please Provide the ID',
                ticket  : {}
          })
     }
}

const edit_ticket = async (req, res) => {
     const id = req.params.id;
     
     if( mongoose.isValidObjectId(id) ){
          const { assignee, discription, priority, project, reportar, title, type, estimate, status, points, comment } = req.body;
          const { _id } = req.user;
          
          // kalitod162@bymercy.com
          const ticketDetail = await Ticket.findById({_id: id});
          let editContent  = []; 
          
          if( title && ticketDetail.title != title ){
               editContent.push('updated the <b>Summary</b>');
          }
          if( assignee && ticketDetail.assignee.toString() != assignee.toString() ){
               editContent.push('changed the <b>Assignee</b>');
          }
          if( reportar && ticketDetail.reportar.toString() != reportar.toString() ){
               editContent.push('changed the <b>Reportar</b>');
          }
          if( discription && ticketDetail.discription != discription ){
               editContent.push('updated the <b>Description</b>');
          }
          if( priority && ticketDetail.priority != priority ){
               editContent.push(`changed the <b>Priority</b> from <b class="bg-opacity-secondary  color-secondary  d-inline-block">${ticketDetail.priority}</b> to <b class="bg-opacity-secondary  color-secondary  d-inline-block">${priority}</b>`);
          }
          if( project && ticketDetail.project.toString() != project.toString() ){
               editContent.push('updated the <b>Project</b>');
          }
          if( type && ticketDetail.type != type ){
               editContent.push(`updated the <b>Type</b> from <b class="bg-opacity-warning color-warning d-inline-block" >${ticketDetail.type}</b> to <b class="bg-opacity-warning color-warning d-inline-block" >${type}</b>`);
          }
          if( estimate && ticketDetail.estimate != estimate ){
               editContent.push('updated the <b>Estimate</b>');
          }
          if( status && ticketDetail.status != status ){
               editContent.push(`changed the <b>Status</b> from <b class="bg-opacity-primary color-primary d-inline-block">${ticketDetail.status}</b> to <b class="bg-opacity-primary color-primary d-inline-block">${status}</b>`);
          }
          if( points && ticketDetail.points != points ){
               editContent.push('updated the <b>Story point</b>');
          }
          if( comment ){
               editContent.push(`added the <b>Comment -</b> ${comment}`);
          }  
         
          let comments = {
               userId : _id,
               content : editContent
          }; 
          
          if( editContent.length > 0 ){
                
               try{

                    const ticket = await Ticket.findByIdAndUpdate(
                         { _id: id }, 
                         { 
                              $set  : { assignee, discription, priority, project, reportar, title, type, estimate, status, points },
                              $push : { "comments": [comments] } 
                         } 
                    );

                    const dataList = await Ticket.findById(id).populate('project').populate('assignee').populate('reportar').populate('board').populate('comments.userId');
     
                    res.json({
                         status : true,
                         message : 'Issue Edit Successfully',
                         data : dataList,
                         ticketList : ticket
                    })  
               }catch(err){
                    if( err.kind === 'Number' ){
                         res.json({
                              status : false,
                              message : 'Please Check all fields',
                              data : {},
                              ticketList : {}
                         })  
                    }else{
                         res.json({
                              status : false,
                              message : 'Some Error in Validation',
                              data : {},
                              ticketList : {}
                         })  
                    }
               }

                 
          }else{
               
               try{
                    const ticket = await Ticket.findByIdAndUpdate(
                         {_id: id }, 
                         { 
                              $set  : { assignee, discription, priority, project, reportar, title, type, estimate, status, points } 
                         } 
                    );
                    
                    const dataList = await Ticket.findById(id).populate('project').populate('assignee').populate('reportar').populate('board').populate('comments.userId');
          
                    res.json({
                         status : true,
                         message : 'Issue Edit Successfully',
                         data : dataList,
                         ticketList : ticket
                    }) 

               }catch(err){
                    if( err.kind === 'Number' ){
                         res.json({
                              status : false,
                              message : 'Please Check all fields',
                              data : {},
                              ticketList : {}
                         })  
                    }else{
                         res.json({
                              status : false,
                              message : 'Some Error in Validation',
                              data : {},
                              ticketList : {}
                         })  
                    }
               }
          } 
          
     }else{
          res.json({
               status : false,
               message : 'Something Wrong with ID',
               data : {}
          }) 
     }
}

module.exports = { get_Data, create_create, get_all, my_tickets, get_ticket, edit_ticket, assign_tickets }