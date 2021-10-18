let blogModel = require("../models/blogModel.js")

let authorModel = require("../models/authorModel.js")

const jwt = require("jsonwebtoken");

const { findOneAndUpdate, find } = require("../models/authorModel.js")

let createBlog = async function (req, res) {
    try {
        if (req.validToken._id == req.body.authorId) {
            if (req.body && Object.keys.length > 0) {
                let blog = req.body
                let author = await authorModel.findById(blog.authorId)
                if (author) {
                    let newBlog = {}
                    blog.title ? newBlog.title = blog.title : res.status(400).send({ Status: false, msg: "title is required" })
                    blog.body ? newBlog.body = blog.body : res.status(400).send({ Status: false, msg: "body is required" })
                    blog.authorId ? newBlog.authorId = blog.authorId : res.status(400).send({ Status: false, msg: "authorId is required" })
                    newBlog.tags = blog.tags
                    blog.category ? newBlog.category = blog.category : res.status(400).send({ Status: false, msg: "category is required" })
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
                res.status(400).send({ Status: false, msg: 'not a valid create request' })
            }
        } else {
            res.status(401).send({ Status: false, msg: "Not Authorized" })
        }
    } catch (error) {
        res.status(500).send({ error: `error message ${error}` })
    }
}


let getBlog = async function (req, res) {
    try {
        if (req.validToken._id) {
            if (req.query && Object.keys(req.query).length > 0) {
                let query = {};
                query.isDeleted = false;
                query.isPublished = true;
                query.authorId = req.validToken._id
                let tags1 = [];
                let sub1 = [];

                if(req.query.title) query.title = req.query.title
                if (req.query.authorId) query.authorId = req.query.authorId;

                if (req.query.category) query.category = req.query.category;
                if (req.query.tags) {
                    tags1 = req.query.tags.split(',')
                    console.log(tags1)
                };

                if (req.query.subcategory) {
                    sub1 = req.query.subcategory.split(',')
                };

                console.log(req.query);
                let blogs = [];
                if (req.query.tags && req.query.subcategory) {
                    blogs = await blogModel.find(
                        {
                            $and: [
                                query,
                                { tags: { $all: tags1 } },
                                { subcategory: { $all: sub1 } },
                            ],
                        },

                        {
                            createdAt: 0,
                            updatedAt: 0,
                            _v: 0,
                            isDeleted: 0,
                            isPublished: 0,
                        }
                    );
                } else if (req.query.tags) {
                    blogs = await blogModel.find(
                        {
                            $and: [query, { tags: { $all: tags1 } }],
                        },

                        {
                            createdAt: 0,
                            updatedAt: 0,
                            _v: 0,
                            isDeleted: 0,
                            isPublished: 0,
                        }
                    );

                } else if (req.query.subcategory) {
                    blogs = await blogModel.find(
                        {
                            $and: [query, { subcategory: { $all: sub1 } }],
                        },

                        {
                            createdAt: 0,
                            updatedAt: 0,
                            _v: 0,
                            isDeleted: 0,
                            isPublished: 0,
                        }
                    );
                } else {
                    blogs = await blogModel.find(
                        query,

                        {
                            createdAt: 0,
                            updatedAt: 0,
                            _v: 0,
                            isDeleted: 0,
                            isPublished: 0,
                        }
                    );
                }
                if (blogs && blogs.length > 0) {
                    res.status(200).send({ status: true, data: blogs });
                } else {
                    res.status(404).send({ status: false, msg: "No blogs found" });
                }
            } else {
                blogs = await blogModel.find({authorId : req.validToken._id, isDeleted : false })
                blogs && Object.keys(blogs).length > 0 ?  res.status(200).send({ Status: false, msg: "Your blogs :", data: blogs }) :  res.status(404).send({ Status: false, msg: "There are no blogs you have created" })
            }
        } else {
            res.status(401).send({ Status: false, msg: "Not authorized" })
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};


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
                    req.body.isPublished == false ? change.publishedAt = "" : ""

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


let deleteBlogId = async function (req, res) {
    try {
        if (req.params.id) {
            let blogs = await blogModel.find({ _id: req.params.id, isDeleted: false }).select("authorId -_id")


            if (blogs && Object.keys(blogs).length > 0) {

                let array = blogs[0]

                if (req.validToken._id == array.authorId) {
                    let blog = await blogModel.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: { isDeleted: true , deletedAt: Date()} }, { new: true })
                    
                } else {
                    res.status(401).send({ Status: false, msg: "Not authorized" })
                }
            } else {
                res.status(404).send({ Status: false, msg: "Blog not found" })
            } 
        }else{
            res.status(400).send({ Status: false, msg: "Not a valid Request" })
            }
        } catch (error) {
            res.status(500).send({ error: `error message ${error}` })
        }
    }


let deleteBlogByQuery = async function (req, res) {
        try {
            if (req.validToken._id) {
                if (req.query && Object.keys(req.query).length > 0) {
                    let query = {};
                    query.isDeleted = false;
                    query.authorId = req.validToken._id;
                    req.query.isPublished ? query.isPublished = req.query.isPublished : ""
                    let tags1 = [];
                    let sub1 = [];


                    if (req.query.category) query.category = req.query.category;
                    if (req.query.tags) {
                        tags1 = req.query.tags.split(',')
                    };

                    if (req.query.subcategory) {
                        sub1 = req.query.subcategory.split(',')
                    };

                    console.log(req.query);
                    let blogs = [];
                    if (req.query.tags && req.query.subcategory) {
                        blogs = await blogModel.updateMany(
                            {
                                $and: [
                                    query,
                                    { tags: { $all: tags1 } },
                                    { subcategory: { $all: sub1 } }
                                ],
                            },

                            { $set: { isDeleted: true, deletedAt: Date() } },

                            {
                                createdAt: 0,
                                updatedAt: 0,
                                _v: 0,
                                isDeleted: 0,
                                isPublished: 0,
                            }
                        );
                        blogs ? res.status(200).send({ Status: true, msg: "Blog deleted" }) : res.status(404).send({ Status: false, msg: "Invalid userId" })
                    } else if (req.query.tags) {
                        blogs = await blogModel.updateMany(
                            {
                                $and: [query, { tags: { $all: tags1 } }],
                            },

                            { $set: { isDeleted: true, deletedAt: Date() } },

                            {
                                createdAt: 0,
                                updatedAt: 0,
                                _v: 0,
                                isDeleted: 0,
                                isPublished: 0,
                            }
                        );
                        blogs ? res.status(200).send({ Status: true, msg: "Blog deleted" }) : res.status(404).send({ Status: false, msg: "Invalid userId" })
                    } else if (req.query.subcategory) {
                        blogs = await blogModel.updateMany(
                            {
                                $and: [query, { subcategory: { $all: sub1 } }],
                            },

                            { $set: { isDeleted: true, deletedAt: Date() } },

                            {
                                createdAt: 0,
                                updatedAt: 0,
                                _v: 0,
                                isDeleted: 0,
                                isPublished: 0,
                            }
                        );
                        blogs ? res.status(200).send({ Status: true, msg: "Blog deleted" }) : res.status(404).send({ Status: false, msg: "Invalid userId" })
                    } else {
                        blogs = await blogModel.updateMany(
                            query,
                            { $set: { isDeleted: true, deletedAt: Date() } },
                            {
                                createdAt: 0,
                                updatedAt: 0,
                                _v: 0,
                                isDeleted: 0,
                                isPublished: 0,
                            });
                        blogs ? res.status(200).send({ Status: true, msg: "Blog deleted" }) : res.status(404).send({ Status: false, msg: "Invalid userId" })
                    }
                } else {
                    res.status(400).send({ Status: false, msg: "Not a Valid request" })
                }
                // if (blogs && blogs.length > 0) {
                //   res.status(200).send({ status: true, msg: "Blog Deleted" });
                // } else {
                //   res.status(404).send({ status: false, msg: "No blogs found" });
                // }
            } else {
                res.status(401).send({ status: false, msg: "Not authorized" });
            }
        } catch (error) {
            res.status(500).send({ status: false, msg: error })
        }
    }

    module.exports.createBlog = createBlog

    module.exports.updateBlog = updateBlog

    module.exports.getBlog = getBlog

    module.exports.deleteBlogId = deleteBlogId

    module.exports.deleteBlogByQuery = deleteBlogByQuery