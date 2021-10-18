let blogModel = require("../models/blogModel.js")

let authorModel = require("../models/authorModel.js")

let updateBlog = async function (req, res) {
    try {
        if (req.params.id && req.body && Object.keys.length > 0) {

            let blogs = await blogModel.find({ _id: req.params.id, isDeleted: false }).select("authorId -_id")


            if (blogs && Object.keys(blogs).length > 0) {

                let array = blogs[0]

                if (req.validToken._id == array.authorId) {
                    let change = {}
                    let changeTags = {}
                    req.body.title ? change.title = req.body.title : ""
                    req.body.body ? change.body = req.body.body : ""
                    req.body.category ? change.category = req.body.category : ""
                    req.body.isPublished ? change.isPublished = req.body.isPublished : ""
                    req.body.isPublished == true ? change.publishedAt = Date() : ""

                    req.body.tags ? changeTags.tags = req.body.tags : ''
                    req.body.subcategory ? changeTags.subcategory = req.body.subcategory : ''


                    let blog = await blogModel.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: change, $push: changeTags }, { new: true })

                    blog ? res.status(200).send({ Status: true, msg: "Blog updated", data: blog }) : res.status(404).send({ Status: false, msg: "Invalid userId" })
                } else {
                    res.status(401).send({ Status: false, msg: "Not Authorized" })
                }
            } else {
                res.status(404).send({ Status: false, msg: "Blog not found" })
            }
        } else {
            res.status(400).send({ Status: false, msg: "Not a valid Request" })
        }
    } catch (error) {
        res.status(500).send({ error: `error message ${error}` })
    }
}


let createBlog = async function (req, res) {
    try {
        if (req.body && Object.keys.length > 0) {
            if (req.validToken._id == req.body.authorId) {
                let blog = req.body
                let author = await authorModel.findById(req.params.authorId)
                if (author) {
                    let newBlog = {}
                    newBlog.title = blog.title
                    newBlog.body = blog.body
                    newBlog.authorId = blog.authorId
                    newBlog.tags = blog.tags
                    newBlog.category = blog.category
                    newBlog.subcategory = blog.subcategory
                    newBlog.isPublished = blog.isPublished
                    if (blog.isPublished === true) {
                        newBlog.publishedAt = Date()
                    }
                    let createdBlog = await blogModel.create(newBlog)
                    res.status(200).send({ Status: true, msg: "Blog created Succsseful :", data: createdBlog })
                } else {
                    res.status(404).send({ Status: false, msg: "Author id is invalid or not found" })
                }
            } else {
                res.status(401).send({ Status: false, msg: "Not Authorized" })
            }


        } else {
            res.status(400).send({ Status: false, msg: 'not a valid create request' })
        }
    } catch (error) {
        res.status(500).send({ error: `error message ${error}` })
    }
}




let deleteBlogId = async function (req, res) {
    try {
        if (req.params.id) {
                    let blog = await blogModel.findOneAndUpdate({ _id:  req.params.id, isDeleted: false }, { $set: { isDeleted: true } }, { new: true })
                    blog ? res.status(200).send({ Status: true, msg: "Blog deleted" }) : res.status(404).send({ Status: false, msg: "Invalid userId" })
                } else {
                    res.status(401).send({ Status: false, msg: "Not Authorized" })
                }
    } catch (error) {
        res.status(500).send({ error: `error message ${error}` })
    }
}


let deleteBlogByQuery = async function (req, res) {
    try {
        if (req.query && Object.keys(req.query).length > 0) {
            req.query.isDeleted = false;
            req.query.authorId =  req.validToken._id
            let blog = await blogModel.findOneAndUpdate(req.query,
                {
                    $set: { isDeleted: true }
                })
            if (blog) {
                res.status(200).send({Status: true, msg:"Blog Deleted:"})
            }
            else {
                res.status(404).send({ status: false, msg: "blog doesn't exist" })
            }
        } else {
            res.status(400).send({ status: false, msg: "must have query" })
        }
    }
    catch (error) {
        res.status(500).send({ status: false, msg: error.msg })
    }
}


let getBlog = async function (req, res) {
    try {
        let blogs = await blogModel.find({ authorId: req.validToken._id, isDeleted: false })
        if (blogs) {
            res.status(200).send({ status: true, data: blogs })
        }
        else {
            res.status(404).send({ status: false, msg: "resource not found" })
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.msg })
    }
}



module.exports.createBlog = createBlog

module.exports.updateBlog = updateBlog

module.exports.getBlog = getBlog

module.exports.deleteBlogId = deleteBlogId

module.exports.deleteBlogByQuery = deleteBlogByQuery