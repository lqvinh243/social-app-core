const { initSocket } = require("./index");
let io;

module.exports.initSocketServer = (http) => {
  io = require("socket.io")(http, {
    cors: "*"
  });

  initSocket(io);
};

module.exports.getIO = () => {
  if (!io) { throw new Error("Socket not init!"); }
  return io;
};
