
const express = require('express');
const router = express.Router();

const AdminController = require('../controllers/AdminController');


//APIs
router.post('/test', AdminController.make_api_request);
router.post('/testParams', AdminController.testParams);



 

module.exports = router;
