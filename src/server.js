const express = require("express");
const fs = require('fs');
const https = require('https');
const cors = require('cors');
const { Server } = require("socket.io");
const app = express();
const { port } = require('./startup/config');
const jwt = require("jsonwebtoken");
const { secret_jwt } = require("./startup/config");
const UserModel = require("./models/user.model");
const ClientModel = require("./models/client.model");
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
const corsOptions = {
  origin: 'https://dom-m.uz', // Your frontend URL
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true
};

app.use(cors(corsOptions));

const privateKey = fs.readFileSync('/etc/letsencrypt/live/dom-m.uz/privkey.pem', 'utf8');
const certificate = fs.readFileSync('/etc/letsencrypt/live/dom-m.uz/fullchain.pem', 'utf8');

const credentials = {
  key: privateKey,
  cert: certificate,
  requestCert: false,
  rejectUnauthorized: false
};

const httpsServer = https.createServer(credentials, app)
const io = new Server(httpsServer, {
  cors: {
    origin: "https://dom-m.uz",
    methods: ["GET", "POST"],
    allowedHeaders: ['Content-Type', 'Authorization'],
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
    console.log(socket.handshake.headers)
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

httpsServer.listen(port, () => console.log(`🚀 Server running on port ${port}!`))
  .on('error', (e) => {
    console.log('Error happened: ', e.message)

  });

module.exports = app;