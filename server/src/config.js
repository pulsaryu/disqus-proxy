const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  port: process.env.PORT ? process.env.PORT : 5050,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
  username: process.env.USERNAME,
  access_token: process.env.ACCESS_TOKEN,
  testPage: ''
};
