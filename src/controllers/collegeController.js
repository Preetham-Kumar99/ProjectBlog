const {validator} = require('../utils')

const collegeModel = require('../models/collegeModel.js')

const registerCollege = async function (req, res) {
    try {
        const requestBody = req.body;
        if(!validator.isValidRequestBody(requestBody)) {
            res.status(400).send({status: false, message: 'Invalid request parameters. Please provide college details'})
            return
        }

        const {name, fullName, logoLink} = requestBody;

        if(!validator.isValid(name)){
            res.status(400).send({status: false, message: 'Name is Required'});
            return
        }

        if(!validator.isValid(fullName)){
            res.status(400).send({status: false, message: 'Fullname is Required'});
            return
        }

        if(!validator.isValid(logoLink)){
            res.status(400).send({status: false, message: 'LogoLink is Required'});
            return
        }

        if(!validator.isValidString(name)){
            res.status(400).send({status: false, message: 'Name should be a string'});
            return
        }

        if(!validator.isValidString(fullName)){
            res.status(400).send({status: false, message: 'Fullname should be a string'});
            return
        }

        if(!validator.isValidString(logoLink)){
            res.status(400).send({status: false, message: 'logoLink should be a string'});
            return
        }

        const isNameAlreadyUsed = await collegeModel.findOne({name});

        if(isNameAlreadyUsed){
            res.status(400).send({status: false, message: `${name} is already in created`});
            return
        }

        const collegeData = {name, fullName, logoLink}
        const newCollege = await collegeModel.create(collegeData);
        
        res.status(201).send({Status: true, msg: "College Details added", Data: newCollege})

    }catch(error){
        res.status(500).send({status: false, message: error.message});
    }    
}


module.exports.registerCollege = registerCollege