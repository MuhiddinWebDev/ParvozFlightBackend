const sequelize = require("../db/db-sequelize");
class SendSockets {
    io;
    socket;
    connects(io, socket, token) {
        this.io = io;
        this.socket = socket;
        this.token = token;
    }
}
module.exports = new SendSockets