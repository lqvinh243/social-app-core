const { ACCESS_TOKEN_SECRET } = require("../../../config/index");
const jwt = require("jsonwebtoken");

function initChannel (io) {
  const nsp = io.of("/comment");
  nsp.use((socket, next) => {
    const token = (socket.handshake.auth).token;
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    socket.userAuthId = decoded.id;
    next();
  });

  nsp.on("connection", (socket) => {
    if (!socket.userAuthId) { socket.disconnect(); }
  });
}

module.exports.initChannel = initChannel;
