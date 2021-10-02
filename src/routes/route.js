const express = require('express');

const router = express.Router();

const { userController, bookController, reviewController } = require('../controllers');
const { userAuth} = require('../middlewares')
// Author routes
router.post('/register', userController.registerUser);

router.post('/login', userController.loginUser);

// Book routes
// router.post('/books', userAuth, bookController.createBook);

// router.get('/books', userAuth, bookController.listBooks);

// router.get('/books/:bookId', userAuth, bookController.getBookById);

// router.put('/books/:bookId', userAuth, bookController.updateBook);

// router.delete('/books/:bookId', userAuth, bookController.deleteBookByID);

// Review routes
router.post('/books/:bookId/review', reviewController.createReview);

router.put('/books/:bookId/review/:reviewId', reviewController.updateReview);

router.delete('/books/:bookId/review/:reviewId', reviewController.deleteReview);


// Writing a File
router.post('/write-file', function (req, res) {
    let files = req.files
    if(files && files.length > 0) {
        let fileName = files[0].originalname
        let fileData = files[0].buffer
        fs.writeFile(`assets/deathNote/${fileName}`, fileData, function(error, data){
            if(error) {
                console.log(error)
                res.status(400).send({status: false, msg: "Invalid file. Please check."})
            } else {
                res.status(201).send('file created')
            }
        })
    } else {
        res.status(400).send({status: false, msg:"No file to write"})
    }
});


module.exports = router;