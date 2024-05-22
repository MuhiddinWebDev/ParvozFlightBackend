const express = require("express");
const app = express();
const { port } = require('./startup/config');
const jwt = require("jsonwebtoken");
const { createServer } = require("https");
const { Server } = require("socket.io");
const { secret_jwt } = require("./startup/config");
const UserModel = require("./models/user.model");
const ClientModel = require("./models/client.model");
const { readFileSync } = require('fs');
require('./startup/cron')();
require('./startup/logging')();
require('./startup/db')();

require('./startup/routes')(app);
require('./startup/migration')();



// const io = require("socket.io")(server, {
//   allowEIO3: true,
//   cors: {
//     origin: true,
//     methods: ["GET", "POST"],
//     credentials: true,
//   },
// });

const httpsServer = createServer({
  key: readFileSync("/etc/letsencrypt/live/api.dom-m.uz/privkey.pem"),
  cert: readFileSync("/etc/letsencrypt/live/api.dom-m.uz/fullchain.pem")
});
const io = new Server(httpsServer, {
  cors: {
    origin: "https://dom-m.uz",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true
  },
  path: "/socket.io",
  pingInterval: 25000,
  pingTimeout: 5000,
  maxHttpBufferSize: 1e6,  // 1 MB
  allowEIO3: true
});

io.use(async (socket, next) => {
  var obj = {};
  try {
    console.log("socket.handshake.query.client_token___________________________")
    console.log(socket.handshake.query)
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
      const model = await ClientModel.findOne({ where: { token: token_client } });
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
  console.log('User connect ' + socket.dataUser.type)
  socket.on("disconnect", () => {
    console.log('User disconnet')
  });
};

io.on("connection", onConnection);
// const server = app.listen(port, () => console.log(`🚀 Server running on port ${port}!`))
//   .on('error', (e) => {
//     console.log('Error happened: ', e.message)

//   });
httpsServer.listen(port, () => console.log(`🚀 Server running on port ${port}!`))
  .on('error', (e) => {
    console.log('Error happened: ', e.message)

  });
module.exports = app;