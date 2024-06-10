const dotenv = require('dotenv');
dotenv.config();

module.exports = {
  "development": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_DATABASE,
    "port": process.env.DB_PORT,
    "host": process.env.HOST,
    "dialect": "mysql",
    "sms_account": process.env.SMS_ACCOUNT,
    "sms_token":process.env.SMS_TOKEN,
    "sms_phone":process.env.SMS_PHONE
  },
  "production": {
    "username": process.env.DB_USER,
    "password": process.env.DB_PASS,
    "database": process.env.DB_DATABASE,
    "port": process.env.DB_PORT,
    "host": process.env.HOST,
    "dialect": "mysql",
    "sms_account": process.env.SMS_ACCOUNT,
    "sms_token":process.env.SMS_TOKEN,
    "sms_phone":process.env.SMS_PHONE
  },
}
