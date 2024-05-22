const sequelize = require("../db/db-sequelize");
class SendSockets {
    io;
    socket;
    connects(io, socket) {
        this.io = io;
        this.socket = socket;
    }
}
module.exports = new SendSockets