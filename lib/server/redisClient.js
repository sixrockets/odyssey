"use strict";

var redis = require('redis');
module.exports = function (app) {
    var redisConf = app.config.redis,
        redisClient = redis.createClient(redisConf.port, redisConf.host, redisConf.options);
    if (process.env.NODE_ENV == 'production') {
        redisClient.auth(app.config.redis.pwd, function () {
            console.log('redis OK');
        });
    }

    redisClient.on("error", function (err) {
        console.log("RedisError: " + err);
    });

    redisClient.on("ready", function (err) {
        console.log("Redis is ready to GO");
        redisClient.exists("tryRedis", redis.print);
    });

    return redisClient;
};