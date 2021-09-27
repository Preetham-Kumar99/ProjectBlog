const mongoose = require('mongoose')
const ObjectId = mongoose.Types.ObjectId

const {validator} = require('../utils')
const {systemConfig} = require('../configs')
const {userModel, bookModel} = require('../models')

const createBook = async function (req, res) {
    try {
        const requestBody = req.body;

        if(!validator.isValidRequestBody(requestBody)) {
            res.status(400).send({status: false, message: 'Invalid request parameters. Please provide blog details'})
            return
        }

        // Extract params
        const {title, excerpt, userId, ISBN, category, subcategory, releasedAt} = requestBody;
        
        // Validation starts
        if(!validator.isValid(title)) {
            res.status(400).send({status: false, message: 'Title is required'})
            return
        }

        if(!validator.isValidString(title)) {
            res.status(400).send({status: false, message: 'Title should be a String'})
            return
        }

        const isTitleAlreadyUsed = await bookModel.findOne({title});

        if(isTitleAlreadyUsed) {
            res.status(400).send({status: false, message: `${title} Title is already used`})
            return
        }

        if(!validator.isValid(excerpt)) {
            res.status(400).send({status: false, message: 'excerpt is required'})
            return
        }
        
        if(!validator.isValidString(excerpt)) {
            res.status(400).send({status: false, message: 'excerpt should be a String'})
            return
        }

        if(!validator.isValid(userId)) {
            res.status(400).send({status: false, message: 'Userid is required'})
            return
        }

        if(!validator.isValidObjectId(userId)) {
            res.status(400).send({status: false, message: `${authorId} is not a valid author id`})
            return
        }

        const isUserIdAlreadyUsed = await userModel.findById(userId);

        if(!isUserIdAlreadyUsed) {
            res.status(400).send({status: false, message: `User doesn't exist`})
            return
        }

        if(!validator.isValid(ISBN)) {
            res.status(400).send({status: false, message: `ISBN is required`})
            return
        }

        if(!validator.isValidString(ISBN)) {
            res.status(400).send({status: false, message: 'ISBN should be a String'})
            return
        }

        const isISBNAlreadyUsed = await bookModel.findOne({ISBN});

        if(isISBNAlreadyUsed) {
            res.status(400).send({status: false, message: `${ISBN} already exists`})
            return
        }

        if(!validator.isValid(category)) {
            res.status(400).send({status: false, message: 'category is required'})
            return
        }

        if(!validator.isValidString(category)) {
            res.status(400).send({status: false, message: 'category should be a String'})
            return
        }

        if(!validator.isValid(subcategory)) {
            res.status(400).send({status: false, message: 'subcategory is required'})
            return
        }

        if(!validator.isValid(releasedAt)) {
            res.status(400).send({status: false, message: `releasedAt is required`})
            return
        }
        // Validation ends

        const bookData = {
            title,
            excerpt,
            userId,
            ISBN,
            category,
            releasedAt
        }

        if(subcategory) {
            if(validator.isArray(subcategory)) {
                bookData['subcategory'] = [...subcategory]
            }
            if(validator.isValidString(subcategory)) {
                bookData['subcategory'] = [ subcategory ]
            }
        }

        const newBook = await bookModel.create(bookData)
        res.status(201).send({status: true, message: 'Book Details added successfully', data: newBook})
    } catch (error) {
        console.log(error)
        res.status(500).send({status: false, message: error.message});
    }
}

const listBooks = async function (req, res) {
    try {
        const filterQuery = {isDeleted: false}
        const queryParams = req.query

        if(validator.isValidRequestBody(queryParams)) {
            const {userId, category, subcategory} = queryParams

            if(validator.isValid(userId) && validator.isValidObjectId(userId)) {
                filterQuery['userId'] = userId
            }

            if(validator.isValid(category)) {
                filterQuery['category'] = category.trim()
            }
            
            if(validator.isValid(subcategory)) {
                const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
                filterQuery['subcategory'] = {$all: subcatArr}
            }
        }

        const books = await bookModel.find(filterQuery,{_id:1,title:1,excerpt:1,userId:1,category:1,releasedAt:1,reviews:1} )
        
        if(Array.isArray(books) && books.length === 0) {
            res.status(404).send({status: false, message: 'No books found'})
            return
        }

        res.status(200).send({status: true, message: 'Books list', data: books})
    } catch (error) {
        res.status(500).send({status: false, message: error.message});
    }
}

// const updateBlog = async function (req, res) {
//     try {
//         const requestBody = req.body
//         const params = req.params
//         const blogId = params.blogId
//         const authorIdFromToken = req.authorId
        
//         // Validation stats
//         if(!validator.isValidObjectId(blogId)) {
//             res.status(400).send({status: false, message: `${blogId} is not a valid blog id`})
//             return
//         }

//         if(!validator.isValidObjectId(authorIdFromToken)) {
//             res.status(400).send({status: false, message: `${authorIdFromToken} is not a valid token id`})
//             return
//         }

//         const blog = await blogModel.findOne({_id: blogId, isDeleted: false, deletedAt: null })

//         if(!blog) {
//             res.status(404).send({status: false, message: `Blog not found`})
//             return
//         }
        
//         if(blog.authorId.toString() !== authorIdFromToken) {
//             res.status(401).send({status: false, message: `Unauthorized access! Owner info doesn't match`});
//             return
//         }

//         if(!validator.isValidRequestBody(requestBody)) {
//             res.status(200).send({status: true, message: 'No paramateres passed. Blog unmodified', data: blog})
//             return
//         }

//         // Extract params
//         const {title, body, tags, category, subcategory, isPublished} = requestBody;

//         const updatedBlogData = {}

//         if(validator.isValid(title)) {
//             if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

//             updatedBlogData['$set']['title'] = title
//         }

//         if(validator.isValid(body)) {
//             if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

//             updatedBlogData['$set']['body'] = body
//         }

//         if(validator.isValid(category)) {
//             if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

//             updatedBlogData['$set']['category'] = category
//         }

//         if(isPublished !== undefined) {
//             if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$set')) updatedBlogData['$set'] = {}

//             updatedBlogData['$set']['isPublished'] = isPublished
//             updatedBlogData['$set']['publishedAt'] = isPublished ? new Date() : null
//         }
        
//         if(tags) {
//             if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$addToSet')) updatedBlogData['$addToSet'] = {}
            
//             if(validator.isArray(tags)) {
//                 updatedBlogData['$addToSet']['tags'] = { $each: [...tags]}
//             }
//             if(validator.isValidString(tags)) {
//                 updatedBlogData['$addToSet']['tags'] = tags
//             }
//         }

//         if(subcategory) {
//             if(!Object.prototype.hasOwnProperty.call(updatedBlogData, '$addToSet')) updatedBlogData['$addToSet'] = {}
//             if(validator.isArray(subcategory)) {
//                 updatedBlogData['$addToSet']['subcategory'] = { $each: [...subcategory]}
//             }
//             if(validator.isValidString(subcategory)) {
//                 updatedBlogData['$addToSet']['subcategory'] = subcategory
//             }
//         }

//         const updatedBlog = await blogModel.findOneAndUpdate({_id: blogId}, updatedBlogData, {new: true})

//         res.status(200).send({status: true, message: 'Blog updated successfully', data: updatedBlog});
//     } catch (error) {
//         res.status(500).send({status: false, message: error.message});
//     }
// }

// const deleteBlogByID = async function (req, res) {
//     try {
//         const params = req.params
//         const blogId = params.blogId
//         const authorIdFromToken = req.authorId

//         if(!validator.isValidObjectId(blogId)) {
//             res.status(400).send({status: false, message: `${blogId} is not a valid blog id`})
//         }

//         if(!validator.isValidObjectId(authorIdFromToken)) {
//             res.status(400).send({status: false, message: `${authorIdFromToken} is not a valid token id`})
//         }

//         const blog = await blogModel.findOne({_id: blogId, isDeleted: false, deletedAt: null })
//         // const blog = await blogModel.findOne({_id: blogId})

//         if(!blog) {
//             res.status(404).send({status: false, message: `Blog not found`})
//         }

//         // if(blog.isDeleted && deletedAt !== null) {
//         //     res.status(404).send({status: false, message: `Blog is already deleted.`}) 
//         // }

//         if(blog.authorId.toString() !== authorIdFromToken) {
//             res.status(401).send({status: false, message: `Unauthorized access! Owner info doesn't match`});
//         }

//         await blogModel.findOneAndUpdate({_id: blogId}, {$set: {isDeleted: true, deletedAt: new Date()}})
//         res.status(200).send({status: true, message: `Blog deleted successfully`})
//     } catch (error) {
//         res.status(500).send({status: false, message: error.message});
//     }
// }

// const deleteBlogByParams = async function (req, res) {
//     try {
//         const filterQuery = {isDeleted: false, deletedAt: null}
//         const queryParams = req.query
//         const authorIdFromToken = req.authorId

//         if(!validator.isValidObjectId(authorIdFromToken)) {
//             res.status(400).send({status: false, message: `${authorIdFromToken} is not a valid token id`})
//             return
//         }

//         if(!validator.isValidRequestBody(queryParams)) {
//             res.status(400).send({status: false, message: `No query params received. Aborting delete operation`})
//             return
//         }

//         const {authorId, category, tags, subcategory, isPublished} = queryParams

//         if(validator.isValid(authorId) && validator.isValidObjectId(authorId)) {
//             filterQuery['authorId'] = authorId
//         }

//         if(validator.isValid(category)) {
//             filterQuery['category'] = category.trim()
//         }

//         if(validator.isValid(isPublished)) {
//             filterQuery['isPublished'] = isPublished
//         }

//         if(validator.isValid(tags)) {
//             const tagsArr = tags.trim().split(',').map(tag => tag.trim());
//             filterQuery['tags'] = {$all: tagsArr}
//         }
        
//         if(validator.isValid(subcategory)) {
//             const subcatArr = subcategory.trim().split(',').map(subcat => subcat.trim());
//             filterQuery['subcategory'] = {$all: subcatArr}
//         }

//         const blogs = await blogModel.find(filterQuery);

//         if(Array.isArray(blogs) && blogs.length === 0) {
//             res.status(404).send({status: false, message: 'No matching blogs found'})
//         }

//         const idsOfBlogsToDelete = blogs.map(blog => {
//             if(blog.authorId.toString() === authorIdFromToken) return blog._id
//         })

//         if(idsOfBlogsToDelete.length === 0) {
//             res.status(404).send({status: false, message: 'No blogs found'})
//         }

//         await blogModel.updateMany({_id: {$in: idsOfBlogsToDelete}}, {$set: {isDeleted: true, deletedAt: new Date()}})

//         res.status(200).send({status: true, message: 'Blog(s) deleted successfully'});
//     } catch (error) {
//         res.status(500).send({status: false, message: error.message});
//     }
// }

module.exports = {
    createBook,
    listBooks,
    // updateBlog,
    // deleteBlogByID,
    // deleteBlogByParams
}
