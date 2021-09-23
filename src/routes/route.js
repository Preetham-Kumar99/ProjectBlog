const express = require('express');

const router = express.Router();

const collegeController = require('../controllers/collegeController')

const internController = require('../controllers/internController')


//college routes
router.post('/colleges', collegeController.registerCollege);

//Intern Routes
router.post('/interns', internController.registerIntern);
router.get('/collegeDetails', internController.getIntern);

module.exports = router;