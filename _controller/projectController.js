const Project = require('../_models/projectModel');
const Ticket = require('../_models/ticketModel');
var mongoose = require('mongoose');

const create_project = async (req, res) => {
    const { title, discription, status, category } = req.body;
    const isUser = req.user._id;
    const project = await Project.create({ title, discription, isUser, status, category });

    if( project ){
        res.json({
            status : true,
            message : 'Project Created Successfully'
        })
    }else{
        res.json({
            status : false,
            message : 'Error in Creation'
        })
    }
}

const get_list = async (req, res) => {
    const project = await Project.find().select('category createdAt discription isActive isUser status title updatedAt').populate({path: 'isUser', select:'firstName lastName email'});
    const ticket = await Ticket.find().select('assignee board createdAt discription estimate points priority project reportar status title type updatedAt').populate({path: 'project', select:'_id'} );
    
    res.json({
          status : true,
          message : 'Project Fetched Successfully...',
          projects : project,
          tickets : ticket
    })
}

const get_detail = async (req, res) => {
    const id = req.params.id;

    if( mongoose.isValidObjectId(id) ){
        const ticket = await Ticket.find({}).where('project').in(id).populate('project').populate('assignee').populate('reportar');
        const project = await Project.findById(id).populate('isUser');
        
        if( project && ticket ){
            res.json({
                status  : true,
                message : 'Project Fetched Successfully askjjdkj',
                tickets : ticket,
                project : project
            })
        }
        else{
            res.json({
                status  : false,
                message : 'No Data Found', 
                tickets : {},
                project : {}
            }) 
        }
    }else{
        res.json({
            status  : 'error',
            message : 'Something Wrong With the Project ID, Please Try Again...', 
            tickets : {},
            project : {}
        }) 
    }
    
}

const edit_project = async (req, res) => {
    const id = req.params.id;

    if( mongoose.isValidObjectId(id) ){
        const { title, discription, category, status } = req.body;
 
        const projectResponse = await Project.findOneAndUpdate({_id: id }, 
                        { $set : { title, discription, category, status } } 
        );
    
        res.json({
            status : true,
            message : 'Project Edit Successfully',
            data : projectResponse
        }) 
    }else{
        res.json({
            status  : false,
            message : 'Something Wrong With the Project ID, Please Try Again...', 
            data : {}
        }) 
    }
    
}

module.exports = { create_project, get_list, get_detail, edit_project }