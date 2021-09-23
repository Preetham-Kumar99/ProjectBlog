const { validator } = require('../utils')

const internModel = require('../models/internModel.js');
const collegeModel = require('../models/collegeModel');

const registerIntern = async function (req, res) {
    try {
        const requestBody = req.body;
        if (!validator.isValidRequestBody(requestBody)) {
            res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide intern details' })
            return
        }

        const { name, email, mobile, collegeName } = requestBody;

        if (!validator.isValid(name)) {
            res.status(400).send({ status: false, message: 'Name is Required' });
            return
        }

        if (!validator.isValid(email)) {
            res.status(400).send({ status: false, message: 'email is Required' });
            return
        }

        if (!validator.isValid(mobile)) {
            res.status(400).send({ status: false, message: 'Mobile No is Required' });
            return
        }

        if (!validator.isValid(collegeName)) {
            res.status(400).send({ status: false, message: 'CollegeName No is Required' });
            return
        }

        if (!validator.isValidString(name)) {
            res.status(400).send({ status: false, message: 'Name should be a string' });
            return
        }

        if (!validator.validateEmail(email)) {
            res.status(400).send({ status: false, message: 'EmailId is not valid' });
            return
        }

        if (!validator.validateMobile(mobile)) {
            res.status(400).send({ status: false, message: 'Mobile No is not valid' });
            return
        }


        if (!validator.isValidString(collegeName)) {
            res.status(400).send({ status: false, message: 'collegeName should be a string' });
            return
        }

        const isEmailAlreadyUsed = await internModel.findOne({ email });

        const isMobileAlreadyUsed = await internModel.findOne({ mobile });

        if (isEmailAlreadyUsed) {
            res.status(400).send({ status: false, message: `${email} is already in used` });
            return
        }

        if (isMobileAlreadyUsed) {
            res.status(400).send({ status: false, message: `${mobile} is already in used` });
            return
        }

        const college = await collegeModel.findOne({ name: collegeName });

        const collegeId = college._id

        if (!collegeId) {
            res.status(400).send({ status: false, message: `collegeName doesn't exist` });
            return
        }

        const internData = { name, email, mobile, collegeId }
        let newIntern = await internModel.create(internData);

        let details = { isDeleted : newIntern.isDeleted, name: newIntern.name, email: newIntern.email, mobile: newIntern.mobile, collegeId: newIntern.collegeId }
        res.status(201).send({ Status: true, msg: "Intern Details added :", Data: details })

    } catch (error) {
        res.status(500).send({ status: false, message: error.message });
    }
}

const getIntern = async function (req, res) {
    try {
        const filterQuery = { isDeleted: false }
        //const queryParams = req.query.collegeName

        if (req.query && Object.keys(req.query).length == 0) {
            res.status(400).send({ status: false, msg: "Requires query params" })
            return
        }

        // const  collegeName  = queryParams

        // if (validator.isValid(collegeName)) {
        //     filterQuery['name'] = req.query.collegeName
        // }


        const college = await collegeModel.findOne({ name: req.query.collegeName, isDeleted: false })
        const interns = await internModel.find({ collegeId: college._id }, {name:1, email:1, mobile:1})

        if (Array.isArray(interns) && interns.length === 0) {
            res.status(404).send({ status: false, message: 'No Interns Registered' })
            return
        }
        console.log(college, college._id, interns, filterQuery)
          
        let details = {name: college.name, fullName: college.fullName, logoLink: college.logoLink, interns: interns }
        res.status(200).send({ status: true, data: details })


    } catch (error) {
        console.log(error)
        res.status(500).send({ status: false, message: error.message });
    }
}


module.exports.registerIntern = registerIntern
module.exports.getIntern = getIntern