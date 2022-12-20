const express = require('express');
const router  = express.Router()
const userController = require('../_controller/userController');

const authMiddleware = require('../_middleware/AuthMiddleware');

app.use((req,res, next)=>{
    res.setHeader('Access-Control-Allow-Origin',"http://localhost:3000");
    res.setHeader('Access-Control-Allow-Headers',"*");
    res.header('Access-Control-Allow-Credentials', true);
    next();
});

router.post('/register', userController.user_register)
router.post('/activate', userController.user_activate)
router.post('/login', userController.user_login)

router.use(authMiddleware);

router.get('/get_lists', userController.get_lists);
router.get('/dashboard', userController.user_dashboard)
router.post('/create', userController.create_karbon)
router.get('/karbon', userController.get_karbon)
router.get('/karbon/:id', userController.get_karbon_detail)
router.post('/karbon/update', userController.update_karbon_detail)
router.post('/karbon/active', userController.active_karbon_detail)

module.exports = router;