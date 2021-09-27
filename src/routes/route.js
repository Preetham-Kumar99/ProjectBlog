const express = require('express');

const router = express.Router();

const {userController, bookController} = require('../controllers');
const {userAuth} = require('../middlewares')
// Author routes
router.post('/register', userController.registerUser);
router.post('/login', userController.loginUser);

// Book routes
router.post('/books',  bookController.createBook);
router.get('/books', bookController.listBooks);
// router.put('/blogs/:blogId', authorAuth, blogController.updateBlog);
// router.delete('/blogs/:blogId', authorAuth, blogController.deleteBlogByID);
// router.delete('/blogs', authorAuth, blogController.deleteBlogByParams);

module.exports = router;