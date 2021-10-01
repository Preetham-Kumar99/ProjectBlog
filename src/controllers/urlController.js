const mongoose = require('mongoose');

const urlModel = require('../models/urlModel');

const {validator} = require('../utils')


const shortUrl = function(req,res){
    try{
        let longUrl = req.body.url;

        if (!longUrl){
            res.status(400).send({Status: false, msg: "Url is Required"})
            return
        }

        let ifLongUrlExists = urlModel.findOne({longUrl},{__v:0, _id:0})

        if(ifLongUrlExists){
            res.status(200).send({Status: false, msg:"Url already exists", data: ifLongUrlExists})
            return
        }

        let temp = true

        while(temp){
            urlCode =  validator.getrandom();
            let ifUrlCodeExists = urlModel.findOne({urlCode})
            if(!ifUrlCodeExists){
                temp = false
            }
        }

        let shortUrl = 'localhost:3000/' + urlCode

        let url = {
            longUrl,
            shortUrl,
            urlCode
        }

        let newUrl = mongoose.create(url)

        res.status(201).send({Status:true, msg:"short url created sucessfully", data: newUrl})

    }catch(error){
        res.status(500).send({Status: false, msg: error.message})
    }
}