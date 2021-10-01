const mongoose = require('mongoose');

const urlModel = require('../models/urlModel');


const shortUrl = function(req,res){
    try{

    }catch(error){
        res.status(500).send({Status: false, msg: error.message})
    }
}