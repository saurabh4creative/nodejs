const User = require('../_models/userModel');
const Project = require('../_models/projectModel');
const Ticket = require('../_models/ticketModel');
const Karbon = require('../_models/karbonModel');

const jwt  = require('jsonwebtoken'); 
const secert = process.env.JWT_SECRET;

const user_register = async (req, res) => {
     const { firstName, lastName, email, password, designation } = req.body;

     const checkUser = await User.findOne({ email });
     
     if( checkUser ){
          res.json({
               status : false,
               message : 'User Already Registed, Please try with Another Email...'
          })
     }
     else{
        
        const otp = Math.floor(1000 + Math.random() * 9000);

        const token = jwt.sign({
            firstName, lastName, email, password, otp, designation
        }, secert, {
            expiresIn: '30d'
        });
        
        res.json({
            status : true,
            message : 'User Registerd Successfully',
            token : token,
            otp : otp
        })
     }
}

const user_activate = async (req, res) => {
     
     const { token, otp1, otp2, otp3, otp4 } = req.body;

     if( token ){
         try{
            const decoded = jwt.verify(token, secert);
            const { firstName, lastName, email, password, otp, designation } = decoded;

            const finalotp = otp1 + otp2 + otp3 + otp4;

            const endOtp = parseInt(finalotp);
  
            const userExists = await User.findOne({ email });
  
            if( userExists ){
                res.json({
                      status  : false,
                      message : 'User Already Registered...'
                }) 
            }
            else{
                
               if( endOtp === otp ){
                     const user = await User.create({
                         firstName, lastName, email, password, designation
                     });

                     res.json({
                         status : true,
                         message : 'User Registed Successfully...',
                         user : user
                     }) 
               }else{
                    res.json({
                         status  : false,
                         message : 'Invalid OTP Please Try with Correct OTP.' 
                    })
               }

               
            } 
         }
         catch(err){ 
            res.json({
                 status : false,
                 message : err.message, 
            })
         }
     }
     else{
         res.json({
              status : false,
              message : 'Token Missing',
         })
     }
}

const user_login = async (req, res) => {
     const { email, password } = req.body; 
     const user = await User.findOne({ email })  

     if(user && (await user.matchPassword(password))){
          const { firstName, lastName, _id } = user;
          const token = jwt.sign({
            firstName, lastName, email, password, _id
          }, secert, {
                expiresIn: '30d'
          });
          res.json({
                status : true,
                message : 'User Login Successfully',
                user : {
                     firstName, lastName, email, _id
                },
                token : token
          })
     }
     else{
          res.json({
               status : false,
               message : 'Invalid Email or Password'
          })
     }
}

const user_dashboard = async (req, res) => {
     const id = req.user._id;
     
     const user = await User.findById(id);
     const project = await Project.find({});
     const ticket = await Ticket.find({});
     const ticketAssign   = await Ticket.find({ assignee : id });
     const ticketReportar = await Ticket.find({ reportar : id });
     const myprojects = await Project.find({ isUser : id });
     const doneticket = await Ticket.find({}).where({status : 'Done'});

     // res.json({
     //      status : true,
     //      message : 'Details Fetch Successfully',
     //      // user : user,
     //      all_projects : project,
     //      my_projects  : myprojects,
     //      my_tickets   : ticketAssign,
     //      all_tickets  :  ticket
     //      // assignee : ticketAssign,
     //      // reportar : ticketReportar,
     //      // myprojects : myprojects,
     //      // allticket : ticket,
     //      // doneticket : doneticket
     // })

     res.json({
          status   : true,
          message  : 'User Details Info',
          userinfo : user,
          projects : project,
          tickets  : ticket,
          my_projects : myprojects,
          my_tickets : ticketReportar,
          assign_tickets : ticketAssign 
     })
}

const user_profile = async (req, res) => {
     const id = req.user._id; 
     const user = await User.findById(id);
     res.json({
          status : true,
          message : 'User Fetched Successfully',
          userinfo : user
     })
}

const create_karbon = async (req, res) => {
     const id = req.user._id; 


     const karbon = await Karbon.create({ 
          name  : req.body.name,
          discription : req.body.discription,
          isUser : id,
          listUser : req.body.user, 
          start : req.body.start,
          end : req.body.end
     });

     res.json({
          status  : true,
          message : 'Data Fetch',
          data : karbon
     })
}

const get_karbon = async (req, res) => {
     const id = req.user._id;

     const kr = await Karbon.find({$or:[{listUser: id}, {isUser : id}]}).populate('isUser').populate('listUser').populate({
          path: 'tickets',
          populate : {
               path : 'project'
          }
     });

     if( Object.keys(kr).length > 0 ){
          res.json({
               status  : true,
               message : 'All Boards Fetch Successfully...',
               data : kr
          })
     }else{
          res.json({
               status  : false,
               message : 'No Board Found',
               data : {}
          })
     }
      
}

var mongoose = require('mongoose');

const get_karbon_detail = async (req, res) => {
     const id = req.user._id;
     
     if( mongoose.isValidObjectId(req.params.id) ){
               const kr = await Karbon.find( { _id : req.params.id, $or:[{listUser: id}, {isUser : id}] } ).populate('isUser').populate('listUser').populate({
                    path: 'tickets',
                    populate : {
                         path : 'assignee'
                    } 
               }).populate({
                    path: 'tickets',
                    populate : {
                         path : 'reportar'
                    } 
               }).populate({
                    path: 'tickets',
                    populate : {
                         path : 'project'
                    } 
               });
               
               
               if( kr.length ){
                    res.json({
                         status  : true,
                         message : 'Data Fetch Successfully',
                         data : kr[0]
                    })
               }else{
                    res.json({
                         status  : false,
                         message : 'Unauthorize Access...',
                         data    : {} 
                    })
               } 
     }else{
          res.json({
               status  : false,
               message : 'Wrond Karbon Board ID. Please check',
               data    : {} 
          })
     } 
}

const update_karbon_detail = async (req, res) => {
     
     const {id, ticket_ID} = req.body;

     const kr = await Karbon.findByIdAndUpdate(id, {$push: {"tickets": [ticket_ID]}} );
     const tk = await Ticket.findByIdAndUpdate(ticket_ID, {$push: {"board": [id]}} );
      
     res.json({
          status  : true,
          message : 'Data Fetch',
          data : kr,
          ticket : tk
     })
}

const active_karbon_detail = async (req, res) => {
     const {sprint_id, isActive, ticketR, ticketP} = req.body;
     
     if( isActive ){
          const karbon = await Karbon.findOneAndUpdate({ _id: sprint_id }, 
               { $set : { isActive : isActive, status : 'Start'  } } 
          );
          res.json({
               status : true,
               message : 'Start Successfully',
               board : karbon
          })
     }else{
          const karbon = await Karbon.findOneAndUpdate({ _id: sprint_id }, 
               { $set : { isActive : isActive, tickets : ticketP, status : 'Completed'  } } 
          );
          
          const ticket = await Ticket.updateMany(
               { _id : { $in: ticketR } },
               { $set  : { board : [] } } 
          ); 

          res.json({
               status  : true,
               message : 'Stop Successfully',
               board   : karbon,
               ticket  : ticket
          })
     } 
}

const get_lists = async (req, res) => {
     const user = await User.find({});
     const project = await Project.find({});

     res.json({
          status : true,
          message : 'Data Fetch Successfully',
          users : user,
          projects : project
     })
}

const get_karbon_update = async (req, res) => {
     const id = req.params.id;
     
     const { name, discription, start, end, user } = req.body;
 
     const karbon = await Karbon.findOneAndUpdate({ _id: id }, 
          { $set : { name, discription, start, end, listUser : user  } } 
     );

     res.json({
          status : true,
          message : 'Board Edit Successfully',
          data : karbon
     }) 
}

module.exports = {user_register, user_activate, user_login, user_dashboard, create_karbon, get_karbon, get_karbon_detail, update_karbon_detail, get_lists, active_karbon_detail, get_karbon_update, user_profile};