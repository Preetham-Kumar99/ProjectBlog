const mongoose = require('mongoose')
const validate = require('validator')

const authorSchema = new mongoose.Schema({
    fname: { type: String, required: true },
    lname: { type: String, required: true },
    title: { type: String, enum: ['Mr', 'Mrs', 'Miss'], required: true },
    email: { 
        type: String, required: true, unique: true,
        // validate(value) {
        //     if (!validator.isEmail(value)) {
        //         throw new Error("Email is invalid");
        //     }
        //   },
    },
    password: { type: String, required: true }
}, { timestamps: true })

module.exports = mongoose.model('Author', authorSchema)