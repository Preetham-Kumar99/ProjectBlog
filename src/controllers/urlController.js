const mongoose = require('mongoose');

const urlModel = require('../models/urlModel');

const redis = require("redis");

const {validator} = require('../utils')

const { promisify } = require("util");

const redisClient = redis.createClient(
    10337,
    "redis-10337.c264.ap-south-1-1.ec2.cloud.redislabs.com",
    { no_ready_check: true }
  );
  redisClient.auth("6L8SXmAlBLG8Z55VsrQtoTd1ugZZ6Qci", function (err) {
    if (err) throw err;
  });
  
  redisClient.on("connect", async function () {
    console.log("Connected to Redis..");
  });

const SET_ASYNC = promisify(redisClient.SET).bind(redisClient);
const SETEX_ASYNC = promisify(redisClient.SETEX).bind(redisClient);
const GET_ASYNC = promisify(redisClient.GET).bind(redisClient);


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

        await SET_ASYNC(`${urlCode}`, createUrl.longUrl);

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

        let longUrl = await GET_ASYNC(`${code}`)

        if(longUrl){
            console.log("url found in cache")
            res.status(200).redirect(longUrl)
            return
        }
        
        let ifUrlExists = await urlModel.findOne({urlCode: code},{__v:0, _id:0})

        if(!ifUrlExists){
            res.status(404).send({Status: false, msg:"Url does not exists"})
            return
        }

        longUrl = ifUrlExists.longUrl
        res.status(200).redirect(longUrl)

    }catch(error){
        res.status(500).send({Status: false, msg: error.message})
    }
}

module.exports = {
    shortUrl,
    getUrl
}