const { ACCESS_TOKEN_SECRET } = require("../../../config/index");
const jwt = require("jsonwebtoken");
let usersOnline = [];

function initChannel (io) {
  const nsp = io.of("/");
  nsp.use((socket, next) => {
    const token = (socket.handshake.auth).token;
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    socket.userAuthId = decoded.id;
    next();
  });

  nsp.on("connection", (socket) => {
    if (!socket.userAuthId) { socket.disconnect(); }
    if (!usersOnline.find(item => item === socket.userAuthId)) {
      usersOnline.push(socket.userAuthId);
      socket.nsp.emit("user_online", { userId: socket.userAuthId });
    }
    socket.on("disconnect", () => {
      usersOnline = usersOnline.filter(item => item !== socket.userAuthId);
      socket.nsp.emit("user_offline", { userId: socket.userAuthId });
    });
  });
}

module.exports.initChannel = initChannel;
module.exports.getUsersOnline = () => usersOnline;
