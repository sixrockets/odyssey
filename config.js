module.exports = function(){
    switch(process.env.NODE_ENV){
        case 'development':
            console.log("development environment set");
            return {
              port  : 3000,
              redis : {port: 6379, host: "127.0.0.1"}
            };

        case 'production':
            console.log("production environment set");
            return {
              secret: process.env.SECRET,
              port  : process.env.PORT,
              redis : {
                url: process.env.REDISCLOUD_URL,
                port: process.env.REDIS_PORT,
                host: process.env.REDIS_HOST,
                user: process.env.REDIS_USER,
                pwd:  process.env.REDIS_PWD,
                options: {no_ready_check: true}
              },
              mongodb: {url: process.env.MONGOHQ_URL },
              slack_api: {
                client_id: process.env.SLACK_CLIENT_ID,
                secret: process.env.SLACK_SECRET
              }
            };

        default:
            console.log("default environment set");
            return {
              secret: 'hack hack hack',
              port  : 3000,
              redis : {port: 6379, host: "127.0.0.1", options: {}},
              mongodb: {url: 'mongodb://localhost/rr_bot'},
              slack_api: {
                client_id: process.env.SLACK_CLIENT_ID,
                secret: process.env.SLACK_SECRET
              }
            };
    }
};
