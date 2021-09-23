const mongoose = require('mongoose')

const {validator} = require('../utils')

const internSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'Name is required'
    },
    email: {
        type: String,
        trim: true,
        lowercase: true,
        unique: true,
        required: 'Email address is required',
        validate: {validator: validator.validateEmail, message: 'Please fill a valid email address', isAsync: false},
        match: [validator.emailRegex, 'Please fill a valid email address']
    },
    mobile: {
        type: Number,
        unique: true,
        required: 'Mobile No. is required',
        validate: {validator: validator.validateMobile , message: 'Please fill a Valid mobile No', isAsync: false},
        match: [validator.mobileRegex, 'Please fill a valid Mobile No']
    },
    collegeId:{
        type: mongoose.Types.ObjectId,
        ref: 'College'
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { timestamps: true })

module.exports = mongoose.model('Intern', internSchema, 'intern')