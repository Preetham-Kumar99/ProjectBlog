const mongoose = require('mongoose')

const jwt = require("jsonwebtoken");

let authorModel = require("../models/authorModel.js")

const validate = require('validator')



let loginAuthor = async function (req, res) {
    try {
      if (req.body && req.body.email && req.body.password) {
        let author = await authorModel.findOne(
          {
            email: req.body.email,
            password: req.body.password,
          },
          { createdAt: 0, updatedAt: 0, __v: 0 }
        );
        if (author) {
          let payload = { _id: author._id };
          let token = jwt.sign(payload, "Secretcode");
  
          res.status(200).send({ status: true, YourToken: token });
        } else {
          res
            .status(401)
            .send({ status: false, msg: "Invalid username or password" });
        }
      } else {
        res
          .status(400)
          .send({
            status: false,
            msg: "Request body must contain userName as well as password",
          });
      }
    } catch (error) {
      res.status(500).send({ status: false, msg: error.message });
    }
  };




let createAuthor = async function (req, res) {
    try {
        if (req.body && Object.keys(req.body).length > 0) {
            let author = req.body
            let newAuthor = {}
            author.fname ? newAuthor.fname = author.fname : res.status(400).send({Status:false, msg:"fname is required"})
            author.lname ? newAuthor.lname = author.lname : res.status(400).send({Status:false, msg:"lname is required"})
            author.title ? newAuthor.title = author.title : res.status(400).send({Status:false, msg:"title is required"})
            author.password ? newAuthor.password = author.password : res.status(400).send({Status:false, msg:"password is required"})
            author.email ? newAuthor.email = author.email : res.status(400).send({Status:false, msg:"email is required"})


            let createdAuthor = await authorModel.create(newAuthor)
            res.status(200).send({ Status: true, msg: "Author Details added succesfully :", data: createdAuthor })
        } else {
            res.status(400).send({ Status: false, msg: 'not a valid create request' })
        }
    } catch (error) {
        res.status(500).send({ error: `error message ${error}` })
    }
}



module.exports.createAuthor = createAuthor


module.exports.loginAuthor = loginAuthor