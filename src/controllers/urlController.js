const mongoose = require('mongoose');

const urlModel = require('../models/urlModel');

const {validator} = require('../utils')


const shortUrl = async function(req,res){
    try{
        let long = req.body.url;

        if (!long){
            res.status(400).send({Status: false, msg: "Url is Required"})
            return
        }

        if(!(validator.validateUrl(long))){
            res.status(400).send({Status: false, msg: "Please enter valid URL"})
            return
        }

        let ifLongUrlExists = await urlModel.findOne({longUrl:long},{__v:0, _id:0})

        if(ifLongUrlExists){
            res.status(200).send({Status: false, msg:"Url already exists", data: ifLongUrlExists})
            return
        }

        let temp = true

        while(temp){
            urlCode =  validator.getrandom();
            let ifUrlCodeExists =await urlModel.findOne({urlCode})
            if(!ifUrlCodeExists){
                temp = false
            }
        }

        let shortUrl = 'localhost:3000/' + urlCode

        let createUrl = {
            longUrl: long,
            shortUrl,
            urlCode
        }

        let newUrl = await urlModel.create(createUrl)

        res.status(201).send({Status:true, msg:"short url created sucessfully", data: newUrl})

    }catch(error){
        res.status(500).send({Status: false, msg: error.message})
    }
}



const getUrl = async function(req,res){
    try{
        let code = req.params.shortUrl;

        if (!code){
            res.status(400).send({Status: false, msg: "Short Url is Required"})
            return
        }

        let ifUrlExists = await urlModel.findOne({urlCode: code},{__v:0, _id:0})

        if(!ifUrlExists){
            res.status(404).send({Status: false, msg:"Url does not exists"})
            return
        }



        let longUrl = ifUrlExists.longUrl
        console.log(longUrl)
        console.log(longUrl.href)
        res.status(200).redirect(longUrl)

    }catch(error){
        res.status(500).send({Status: false, msg: error.message})
    }
}

module.exports = {
    shortUrl,
    getUrl
}