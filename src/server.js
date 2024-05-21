const express = require("express");
const app = express();
const { port } = require('./startup/config');
const jwt = require("jsonwebtoken");
const { secret_jwt } = require("./startup/config");

const ChatProModel = require("./models/chatPro.model");
const UserModel = require("./models/user.model");
const ClientModel = require("./models/client.model")

require('./startup/cron')();
require('./startup/logging')();
require('./startup/db')();

require('./startup/routes')(app);
require('./startup/migration')();

const server = app.listen(port, () => console.log(`🚀 Server running on port ${port}!`))
    .on('error', (e) => {
        console.log('Error happened: ', e.message)

    });
const io = require("socket.io")(server, {
    allowEIO3: true,
    cors: {
        origin: true,
        methods: ["GET", "POST"],
        credentials: true,
    },
});
io.use(async (socket, next) => {
    var obj = {};
    try {
      if (socket.handshake.query.token_user) {
        const token_user = socket.handshake.query.token_user;
        const payload = jwt.verify(token_user, secret_jwt);
        const model = await UserModel.findOne({ where: { id: payload.user_id } });
        obj.userId = model.id;
        obj.type = "User";
        obj.userName = model.fullname;
      }
  
      if (socket.handshake.query.client_token) {
        const token_client = socket.handshake.query.client_token;
        const payload = jwt.verify(token_client, secret_jwt);
        const model = await ClientModel.findOne({ where: { id: payload.user_id } });
        obj.userId = model.id;
        obj.type = "Client";
        obj.userName = model.number;
      }
  
      
      socket.dataUser = obj;
      next();
    } catch (err) {
      // console.log(err, 'Socket Connection error');
    }
  });
const chatProController = require("./controllers/chatPro.controller");
const sockets = require('./socket/socket')
const onConnection = (socket) => {
    chatProController.socketConnect(io, socket);
    sockets.connects(io, socket);
    console.log('User connect ' + socket.dataUser.userId)
    socket.on("disconnect", () => {
      console.log('User disconnet')
    });
  };
  
io.on("connection", onConnection);
module.exports = app;