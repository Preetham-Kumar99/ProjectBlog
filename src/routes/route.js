const express = require('express');

let authorController = require("../controllers/authorController.js")

let blogController = require("../controllers/blogController.js")

let loginController = require("../controllers/loginController.js")

const jwt = require("jsonwebtoken");


const router = express.Router();


let tokenCheck = function (req, res, next) {

    let token
    req.headers['x-api-key'] ? token = req.headers['x-api-key'] : res.status(400).send({Status: false, msg:"Token is Required for validation"})

    
    let validToken = jwt.verify(token, 'Secretcode')

    if (!validToken) { res.status(403).send({Status:false, msg:"Invalid Token"}); return;}

    if (validToken) {
        req.validToken = validToken
        next()
    } else {
        res.status(401).send({ status: false, msg: "Invalid token" })
    }
}




// Create Author
router.post('/author', authorController.createAuthor)


//UpdateBlog
router.put('/:id/blog', tokenCheck, blogController.updateBlog)

// createBlog
router.post('/blog', tokenCheck ,blogController.createBlog)

// , tokenCheck 

// getblogs
router.get('/blog', tokenCheck  ,blogController.getBlog)



// Delete blog with id 
router.delete('/:id/blog', tokenCheck, blogController.deleteBlogId)

// delete blog with params
router.delete('/blog/', tokenCheck ,blogController.deleteBlogByQuery)









//Author login
router.post('/login', authorController.loginAuthor)

// //UpdateBlog with author
// router.put('/author/:id/blog', tokenCheck, loginController.updateBlog)

// // createBlog with author
// router.post('/author/blog', tokenCheck, loginController.createBlog)


// // getblogs with author
// router.get('/author/blogs', tokenCheck, loginController.getBlog)


// // Delete blog with id  with author
// router.delete('/author/:id/blog', tokenCheck, loginController.deleteBlogId)

// // delete blog with params with author
// router.delete('/author/blog', tokenCheck, loginController.deleteBlogByQuery)


// XYZ routes
module.exports = router;