const { validationResult } = require('express-validator');
const HttpException = require('../utils/HttpException.utils');

var axios = require('axios');

const serviceAccount = require("../../parvoz-flight-firebase.json");
const admin = require('firebase-admin');
admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: `https://${serviceAccount.project_id}.firebaseio.com`
});

class BaseController {
    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, req.mf('Validation faild'), errors);
        }
    }


    // Notification for client
    notification = (message) => {
        let s = {
            notification: {
                title: message.notification.title,
                body: message.notification.body
            },
            token: message.to, // tokens should be an array of device tokens
        };
        try {
            admin.messaging().send(s)
                .then((response) => { 
                    console.log(response);
                })
                .catch((error) => { 
                    console.log("error_____________--");
                    console.log(error);
                });
        } catch (e) { 
            console.log(e);
        }
    }


    sendSmsToLogin = (data) => {

        var config = {
            method: 'post',
            url: 'https://yboburzhon@bk.ru:8afKebWawXU6BVX8bcZVweCBx-ArZVEM@gate.smsaero.ru/v2/sms/send',
            headers: {
                'Content-Type': 'application/json',
                // 'Cookie': '_csrf=445710372ce325b270e169dca0c6dade7605a2b0b16902a3b1d91f76256a9d6ca%3A2%3A%7Bi%3A0%3Bs%3A5%3A%22_csrf%22%3Bi%3A1%3Bs%3A32%3A%22XOiVBtjdhS0UrZ-zkn-AMM38WXO2nHNR%22%3B%7D'
            },
            data: data
        };

        axios(config)
            .then(function (response) {
                console.log(JSON.stringify(response.data));
            })
            .catch(function (error) {
                console.log(error);
            });
    }
}

module.exports = BaseController;