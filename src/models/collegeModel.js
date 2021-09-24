const mongoose = require('mongoose')

const collegeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: 'College name is required',
        lowercase: true,
        unique: true,
        trim: true
    },
    fullName: {
        type: String,
        required: "College's Fullname is required",
    },
    logoLink: {
        type: String,
        required: 'Title is required',
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}
)

module.exports = mongoose.model('College', collegeSchema, 'college')