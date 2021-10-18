let updateBlog = async function (req, res) {
    try {
        if (req.params.id && req.body && Object.keys.length > 0) {
            let change = {}
            let changeTags = {}
            req.body.title ? change.title = req.body.title : ""
            req.body.body ? change.body = req.body.body : ""
            req.body.authorId ? change.authorId = req.body.authorId : ""
            req.body.category ? change.category = req.body.category : ""
            req.body.isPublished ? change.isPublished = req.body.isPublished : ""
            req.body.isPublished == true ? change.publishedAt = Date() : ""

            req.body.tags ? changeTags.tags = req.body.tags : ''
            req.body.subcategory ? changeTags.subcategory = req.body.subcategory : ''

            let set = { $set: change }
            let push = { $push: changeTags }
            let Actualchange = Object.assign(set, push)

            let blog = await blogModel.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { Actualchange }, { new: true })

            blog ? res.status(200).send({ Status: true, msg: "Blog updated", data: blog }) : res.status(404).send({ Status: false, msg: "Invalid userId" })
        } else {
            res.status(400).send({ Status: false, msg: "Not a valid Request" })
        }
    } catch (error) {
        res.status(500).send({ error: `error message ${error}` })
    }
}





let updateBlog = async function (req, res) {
    try {
        if (req.params.id && req.body && Object.keys.length > 0) {
            if (req.body.isPublished === true) {
                let blog = await blogModel.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: req.body, publishedAt: Date() }, { new: true })

                blog ? res.status(200).send({ Status: true, msg: "Blog updated", data: blog }) : res.status(404).send({ Status: false, msg: "Invalid userId" })
            } else {
                let blog = await blogModel.findOneAndUpdate({ _id: req.params.id, isDeleted: false },
                    { $set: { title: req.body.title, body: req.body.body }, $push: { tags: req.body.tags, subcategory: req.body.subcategory } }, { new: true })

                blog ? res.status(200).send({ Status: true, msg: "Blog updated", data: blog }) : res.status(404).send({ Status: false, msg: "Invalid userId" })
            }
        } else {
            res.status(400).send({ Status: false, msg: "Not a valid Request" })
        }
    } catch (error) {
        res.status(500).send({ error: `error message ${error}` })
    }
}



let getBlogs = async function (req, res) {
    try {
        let query = { isDeleted: false };

        if (req.query.authorId) query.authorId = req.query.authorId;
        if (req.query.category) query.category = req.query.category;
        if (req.query.tags) query.tags = req.query.tags;
        if (req.query.subcategory) query.subcategory = req.query.subcategory;
        console.log(query);
        let blogs = await blogModel.find(query, {
            createdAt: 0,
            updatedAt: 0,
            _v: 0,
            isDeleted: 0,
            isPublished: 0,
        });
        if (blogs && blogs.length > 0) {
            res.status(200).send({ status: true, data: blogs });
        } else {
            res.status(404).send({ status: false, msg: "No blogs found" });
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};




let deleteBlog = async function (req, res) {
    try {
        if (req.query && Object.keys(req.query).length > 0) {
            let query = { isDeleted: false };

            if (req.query.authorId) query.authorId = req.query.authorId;
            if (req.query.category) query.category = req.query.category;
            if (req.query.tags) query.tags = req.query.tags;
            if (req.query.subcategory) query.subcategory = req.query.subcategory;
            console.log(query);
            let blogs = await blogModel.updateMany(query, { $set: { isDeleted: true } }, {
                createdAt: 0,
                updatedAt: 0,
                _v: 0,
                isDeleted: 0,
                isPublished: 0,
            });
            blogs ? res.status(200).send({ Status: true, msg: "Blog Deleted :" }) : res.status(404).send({ Status: false, msg: "Invalid blogId" })
        }
    } catch (error) {
        res.status(500).send({ msg: `error message`, err: error })
    }
}



let deleteBlog = async function (req, res) {
    try {
        if (req.query && Object.keys(req.query).length > 0) {
            if (req.query.title) {
                let blog = await blogModel.updateMany({ title: req.query.title, isDeleted: false }, { $set: { isDeleted: true } }).select("-_id")
                blog ? res.status(200).send({ Status: true, msg: "Blog Deleted :" }) : res.status(404).send({ Status: false, msg: "Invalid blogId" })
            } else if (req.query.authorId) {
                let blog = await blogModel.updateMany({ authorId: req.query.authorId, isDeleted: false }, { $set: { isDeleted: true } }).select("-_id")
                blog ? res.status(200).send({ Status: true, msg: "Blog Deleted :" }) : res.status(404).send({ Status: false, msg: "Invalid blogId" })
            } else if (req.query.category) {
                let blog = await blogModel.updateMany({ category: req.query.category, isDeleted: false }, { $set: { isDeleted: true } }).select("-_id")
                blog ? res.status(200).send({ Status: true, msg: "Blog Deleted :" }) : res.status(404).send({ Status: false, msg: "Invalid blogId" })
            } else if (req.query.tags) {
                let blog = await blogModel.updateMany({ tags: { $in: req.query.tags }, isDeleted: false }, { $set: { isDeleted: true } }).select("-_id")
                blog ? res.status(200).send({ Status: true, msg: "Blog Deleted :" }) : res.status(404).send({ Status: false, msg: "Invalid blogId" })
            } else if (req.query.subcategory) {
                let blog = await blogModel.updateMany({ subcategory: { $in: req.query.subcategory }, isDeleted: false }, { $set: { isDeleted: true } }).select("-_id")
                blog ? res.status(200).send({ Status: true, msg: "Blog Deleted :" }) : res.status(404).send({ Status: false, msg: "Invalid blogId" })
            }
        } else {
            res.status(400).send({ Status: false, msg: "needs a param to delete the file" })
        }
    } catch (error) {
        res.status(500).send({ msg: `error message`, err: error })
    }
}



let getBlogs = async function (req, res) {
    try {
        if (req.query) {
            console.log(req.query)
            req.query.isPublished = true;
            req.query.isDeleted = false;
            let blogs = await blogModel.find(req.query)
            if (blogs) {
                res.status(200).send({ status: true, data: blogs })
            }
            else {
                res.status(404).send({ status: false, msg: "resource not found" })
            }
        }
        else {
            let blogs = await blogModel.find({ isDeleted: false, isPublished: true })
            if (blogs) {
                res.status(200).send({ status: true, data: blogs })
            }
            else {
                res.status(404).send({ status: false, msg: "resource not found" })
            }
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.msg })
    }
}



let getBlog = async function (req, res) {
    try {
        let query = { isDeleted: false };

        if (req.query.authorId) query.authorId = req.query.authorId;
        if (req.query.category) query.category = req.query.category;
        if (req.query.tags) query.tags = {$in: req.query.tags}
        if (req.query.subcategory) query.subcategory = {$in: req.query.subcategory};
        let blogs = await blogModel.find(query, {
            createdAt: 0,
            updatedAt: 0,
            _v: 0,
            isDeleted: 0,
            isPublished: 0,
        });
        if (blogs && blogs.length > 0) {
            res.status(200).send({ status: true, data: blogs });
        } else {
            res.status(404).send({ status: false, msg: "No blogs found" });
        }
    } catch (error) {
        res.status(500).send({ status: false, msg: error.message });
    }
};



let getBlog = async function (req, res) {
    try {
        if (req.query) {
            let search = {}
            let arraysearch = []
            search.isPublished = true;
            search.isDeleted = false;
            console.log(req.query.tags)
            if (req.query.tags) {
                let tags = req.query.tags
                arraysearch = tags.split(',')
                console.log(typeof (arraysearch))
                console.log(arraysearch)
            }
            let blogs = await blogModel.find(search, { tags: { $in: arraysearch } })
            if (blogs) {
                res.status(200).send({ status: true, data: blogs })
            }
            else {
                res.status(404).send({ status: false, msg: "resource not found" })
            }
        }
        else {
            let blogs = await blogModel.find({ isDeleted: false, isPublished: true })
            if (blogs) {
                res.status(200).send({ status: true, data: blogs })
            }
            else {
                res.status(404).send({ status: false, msg: "resource not found" })
            }
        }
    }
    catch (error) {
        console.log(error)
        res.status(500).send({ status: false, msg: error.msg })
    }
}




validate(author.email); {
    if (!validator.isEmail(value)) {
        throw new Error("Email is invalid");
    } else {
        newAuthor.email = author.email
    }
}




let updateBlog = async function (req, res) {
    try {
        if(req.validToken._id){
        if (req.params.id && req.body && Object.keys.length > 0) {
            let change = {}
            let changeTags = {}
            req.body.title ? change.title = req.body.title : ""
            req.body.body ? change.body = req.body.body : ""
            req.body.category ? change.category = req.body.category : ""
            req.body.isPublished ? change.isPublished = req.body.isPublished : ""
            req.body.isPublished == true ? change.publishedAt = new Date() : ""

            req.body.tags ? changeTags.tags = req.body.tags : ''
            req.body.subcategory ? changeTags.subcategory = req.body.subcategory : ''


            let blog = await blogModel.findOneAndUpdate({ _id: req.params.id, isDeleted: false }, { $set: change, $push: changeTags }, { new: true })

            blog ? res.status(200).send({ Status: true, msg: "Blog updated", data: blog }) : res.status(404).send({ Status: false, msg: "Invalid userId" })
        } else {
            res.status(400).send({ Status: false, msg: "Not a valid Request" })
        }
    }else{
        res.status(401).send({ Status: false, msg: "Not authorized" })
    }
    } catch (error) {
        res.status(500).send({ error: `error message ${error}` })
    }
}