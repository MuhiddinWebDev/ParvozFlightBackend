const HttpException = require('../utils/HttpException.utils');
const AgentModel = require('../models/agent.model');

const agentAuth  = () => {
    return async function (req, res, next) {
        try {
            const token = req.headers.token;
            
            const agent = await AgentModel.findOne({ where: {token: token }});
            
            if (!agent) {
                throw new HttpException(401, req.mf('Authentication failed!'));
            }

            req.currentAgent = agent;
            
            next();

        } catch (e) {
            e.status = 401;
            next(e);
        }
    }
}
module.exports = agentAuth;