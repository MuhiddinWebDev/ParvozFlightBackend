const express = require("express");
const cors = require("cors");
const path = require("path");
const cookieParser = require('cookie-parser')
const i18n = require('./i18n.config')
const errorMiddleware = require('../middleware/error.middleware');
const userRouter = require('../routes/user.route');
const bannerRouter = require('../routes/banner.route');
const clientRouter = require('../routes/client.route');
const servicesRouter = require('../routes/services.route');
const orderRouter = require('../routes/order.route');
const chatRouter = require('../routes/chat.route');
const agentRouter = require('../routes/agent.route');
const reviewsRouter = require('../routes/reviews.route');
const workRouter = require('../routes/work.route');
const addressRouter = require('../routes/address.route');
const addressBiletRouter = require('../routes/addressBilet.route');
const ticketsRouter = require('../routes/tickets.route');
const transportRouter = require('../routes/transport.route');
const roomRouter = require('../routes/room.route');
const serviceCategoryRouter = require('../routes/serviceCategory.route');
const bookedTicketRouter = require('../routes/bookedTicket.route');
const bonusRouter = require("../routes/bonus.route");
const menuTableRouter = require("../routes/menuTable.route");
const reportRouter = require("../routes/report.route");

const HttpException = require('../utils/HttpException.utils');

module.exports = async function (app) {
    // parse requests of content-type: application/json
    // parses incoming requests with JSON payloads
    app.use(express.json());
    // enabling cors for all requests by using cors middleware
    app.use(cors());
    // Enable pre-flight
    app.options("*", cors());
    app.use(express.static(path.join(__dirname, '../../dist')));
    // i18n.setLocale('uz');
    app.use(cookieParser());
    app.use(i18n.init)
    //Responsni mobilega moslash
    app.use(function (req, res, next) {
        var send = res.send;
        res.send = function (body) {
            let status = res.statusCode;
            let error_code = -1;
            if (
                req.get('mobile') &&
                (typeof body == 'object')
            ) {
                let error = false;
                let message = body.message;
                if (body.errors) {
                    message = message + ': ' + body.errors[0].msg;
                }

                if (!(status == 200 || status == 201)) {
                    error = true;
                    body = null;
                } else if (body.error) {
                    error = true;
                    body = null;
                }

                if (!message) {
                    message = 'Info';
                }

                if (status == 204) { body = {}; error = false; }

                if (status == 401) {
                    body = null;
                    error = true;
                    error_code = 401;
                }

                body = {
                    success: !error,
                    error_code: error_code,
                    message,
                    data: body,
                };
                res.statusCode = 200;
            }
            send.call(this, body);
        };

        next();
    });

    app.use(`/api/v1/uploads/banner`, express.static('uploads/banner'));
    app.use(`/api/v1/uploads/icon`, express.static('uploads/icon'));
    app.use(`/api/v1/uploads/reviews`, express.static('uploads/reviews'));
    app.use(`/api/v1/uploads/image`, express.static('uploads/image'));
    app.use(`/api/v1/uploads/file`, express.static('uploads/file'));
    app.use(`/api/v1/uploads/voice`, express.static('uploads/voice'));
    app.use(`/api/v1/uploads/work`, express.static('uploads/work'));
    app.use(`/api/v1/uploads/room`, express.static('uploads/room'));
    app.use(`/api/v1/uploads/category`, express.static('uploads/category'));
    app.use(`/api/v1/uploads/client`, express.static('uploads/client'));

    app.use(`/api/v1/users`, userRouter);
    app.use(`/api/v1/banner`, bannerRouter);
    app.use(`/api/v1/client`, clientRouter);
    app.use(`/api/v1/services`, servicesRouter);
    app.use(`/api/v1/order`, orderRouter);
    app.use(`/api/v1/chat`, chatRouter);
    app.use(`/api/v1/reviews`, reviewsRouter);
    app.use(`/api/v1/agent`, agentRouter);
    app.use(`/api/v1/work`, workRouter);
    app.use(`/api/v1/address`, addressRouter);
    app.use(`/api/v1/address-bilet`, addressBiletRouter);
    app.use(`/api/v1/tickets`, ticketsRouter);
    app.use(`/api/v1/transport`, transportRouter);
    app.use(`/api/v1/room`, roomRouter);
    app.use(`/api/v1/service-category`, serviceCategoryRouter);
    app.use(`/api/v1/booked-ticket`, bookedTicketRouter);
    app.use(`/api/v1/bonus`, bonusRouter);
    app.use(`/api/v1/menu-table`, menuTableRouter);
    app.use(`/api/v1/report`, reportRouter);
    // 404 error
    app.all('*', (req, res, next) => {
        const err = new HttpException(404, req.mf('Endpoint not found'));
        next(err);
    });

    app.use(errorMiddleware);
}