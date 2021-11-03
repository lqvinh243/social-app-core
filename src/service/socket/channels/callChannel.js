const { ACCESS_TOKEN_SECRET } = require("../../../config/index");
const jwt = require("jsonwebtoken");
let usersInCall = [];
const { getUsersOnline } = require("./index");

function initChannel (io) {
  const nsp = io.of("/call");
  nsp.use((socket, next) => {
    const token = (socket.handshake.auth).token;
    const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
    socket.userAuthId = decoded.id;
    next();
  });

  nsp.on("connection", (socket) => {
    if (!socket.userAuthId) { socket.disconnect(); }

    socket.join(socket.userAuthId);

    socket.on("start_call", (userId) => {
      const usersOnline = getUsersOnline();
      if (!usersOnline.includes(userId)) {
        socket.nsp.to(socket.userAuthId).emit("start_call", { code: "Error", msg: "User not online" });
      } else if (usersInCall.includes(userId)) {
        socket.nsp.to(socket.userAuthId).emit("start_call", { code: "Error", msg: "User in another call" });
      } else {
        usersInCall.push(socket.userAuthId);
        socket.nsp.to(socket.userAuthId).emit("start_call", { code: "Success", msg: "Success call" });
      }
    });

    socket.on("accept_call", () => {
      usersInCall.push(socket.userAuthId);
    });

    socket.on("denied_call", (userId) => {
      socket.nsp.to(userId).emit("denied_call", (socket.userAuthId));
    });

    socket.on("cancel_call", (userId) => {
      usersInCall = usersInCall.filter(item => item !== socket.userAuthId);
      if (userId) {
        usersInCall = usersInCall.filter(item => item !== userId);
        socket.nsp.to(userId).emit("cancel_call");
      }
    });

    socket.on("disconnect", () => {
      usersInCall = usersInCall.filter(item => item !== socket.userAuthId);
    });
  });
}

module.exports.initChannel = initChannel;
module.exports.getUsersInCall = () => usersInCall;
