const HttpException = require('../utils/HttpException.utils');
const ClientModel = require('../models/client.model');

const auth = () => {
    return async function (req, res, next) {
        try {

            const token = req.headers.token;
            console.log(token)
        
            const client = await ClientModel.findOne({ where: {token: token }});
         
            if (!client) {
                throw new HttpException(401, req.mf('Authentication failed!'));
            }

            // if the client has permissions
            req.currentClient = client;
            next();

        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}

module.exports = auth;