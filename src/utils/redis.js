const redis = require("redis");

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

module.exports = {
    SET_ASYNC,
    SETEX_ASYNC,
    GET_ASYNC
}