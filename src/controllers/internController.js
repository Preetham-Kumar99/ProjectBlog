const {validator} = require('../utils')

const internModel = require('../models/internModel.js');
const collegeModel = require('../models/collegeModel');

const registerIntern = async function (req, res) {
    try {
        const requestBody = req.body;
        if(!validator.isValidRequestBody(requestBody)) {
            res.status(400).send({status: false, message: 'Invalid request parameters. Please provide intern details'})
            return
        }

        const {name, email, mobile, collegeName} = requestBody;

        if(!validator.isValid(name)){
            res.status(400).send({status: false, message: 'Name is Required'});
            return
        }

        if(!validator.isValid(email)){
            res.status(400).send({status: false, message: 'email is Required'});
            return
        }

        if(!validator.isValid(mobile)){
            res.status(400).send({status: false, message: 'Mobile No is Required'});
            return
        }

        if(!validator.isValid(collegeName)){
            res.status(400).send({status: false, message: 'CollegeName No is Required'});
            return
        }

        if(!validator.isValidString(name)){
            res.status(400).send({status: false, message: 'Name should be a string'});
            return
        }

        if(!validator.validateEmail(email)){
            res.status(400).send({status: false, message: 'EmailId is not valid'});
            return
        }

        if(!validator.validateMobile(mobile)){
            res.status(400).send({status: false, message: 'Mobile No is not valid'});
            return
        }

        
        if(!validator.isValidString(collegeName)){
            res.status(400).send({status: false, message: 'collegeName should be a string'});
            return
        }

        const isEmailAlreadyUsed = await internModel.findOne({email});

        const isMobileAlreadyUsed = await internModel.findOne({mobile});

        if(isEmailAlreadyUsed){
            res.status(400).send({status: false, message: `${email} is already in used`});
            return
        }

        if(isMobileAlreadyUsed){
            res.status(400).send({status: false, message: `${mobile} is already in used`});
            return
        }

        const college = await collegeModel.findOne({name: collegeName});

        const collegeId = college._id

        if(!collegeId){
            res.status(400).send({status: false, message: `collegeName does'nt exist`});
            return
        }

        const internData = {name, email, mobile, collegeId}
        const newIntern = await internModel.create(internData);
        
        res.status(201).send({Status: true, msg: "Intern Details added :", Data: newIntern})

    }catch(error){
        res.status(500).send({status: false, message: error.message});
    }    
}


module.exports.registerIntern = registerIntern