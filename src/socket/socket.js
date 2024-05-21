const sequelize = require("../db/db-sequelize");
const ChatProModel  = require("../models/chatPro.model");

class SendSockets {
    io;
    socket;
    connects(io, socket) {
        this.io = io;
        this.socket = socket;
    }
    async sendClientLocation(order_id, text, voice, file, image) {
        try {
            const sockets = await this.io.fetchSockets()
        } catch (e) {

        }
    }

}
module.exports = new SendSockets