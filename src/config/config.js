const dotenv = require('dotenv');

dotenv.config(
    {
        path:"./src/.env",
        override: true
    }
);

const config = {
    PORT:process.env.PORT || 8080,
    MONGO_URL:process.env.MONGO_URL ,
    PERSISTENCE: process.env.PERSISTENCE || 'MONGO',
    SECRET: process.env.SECRET,
    env: process.env.NODE_ENV || 'development',

}


module.exports = config ;