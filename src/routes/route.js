const express = require('express');

const router = express.Router();

const collegeController = require('../controllers/collegeController')


//college routes
router.post('/colleges', collegeController.registerCollege);


module.exports = router;