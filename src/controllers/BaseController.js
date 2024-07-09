const { validationResult } = require('express-validator');
const HttpException = require('../utils/HttpException.utils');

var FCM = require('fcm-node');
var serverKey = 'AAAAQ9Vgmt4:APA91bErHb6mfOo1b-vU-hwVn_EAgqs4roasCZy0bmG4sDpLobG5qHKIk5b3G71RcZq_9cc8Zl6GjSSptAVBNMiWB3_kJiisdpoYC8zGYSQd0Lzg3kPkOd12G1ojQ8ZNrB7QW6NE5SQs';
// var new_se_key = "BFi00plE6qt0qEokvYjq6xW8uhxVMoV1ugSOL-qWRfeLy_-emiPzjEZ5m4GK95pqdu87jQYtZWEKQAOo36j_lSw"
var fcm = new FCM(serverKey);

var axios = require('axios');

class BaseController {
    checkValidation = (req) => {
        const errors = validationResult(req)
        if (!errors.isEmpty()) {
            throw new HttpException(400, req.mf('Validation faild'), errors);
        }
    }


    // Notification for client
    notification = (message) => {
        fcm.send(message, function (err, response) {
            if (err) {
                console.log('Test')
                console.log("Something has gone wrong!" + err);
                console.log("Respponse:! " + response);
            }
        });
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