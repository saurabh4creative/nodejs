const express = require('express');
const router  = express.Router();

const whitelist = ["http://localhost:3000"]

const corsOptions = {
  origin: function (origin, callback) {
    if (!origin || whitelist.indexOf(origin) !== -1) {
      callback(null, true)
    } else {
      callback(new Error("Not allowed by CORS"))
    }
  },
  credentials: true,
}

app.use(cors(corsOptions));

const projectController = require('../_controller/projectController'); 
const authMiddleware = require('../_middleware/AuthMiddleware');

router.use(authMiddleware);
router.post('/create', projectController.create_project);
router.get('/all', projectController.get_list);
router.get('/detail/:id', projectController.get_detail);

module.exports = router;