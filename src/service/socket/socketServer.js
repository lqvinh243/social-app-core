const redisAdapter = require("socket.io-redis");
const { initSocket } = require("./index");
const { REDIS_HOST, REDIS_PORT, REDIS_PASSWORD } = require("../../config/index");
let io;

module.exports.initSocketServer = (http) => {
  io = require("socket.io")(http, {
    cors: "*"
  });

  io.adapter(redisAdapter({
    host: REDIS_HOST,
    port: REDIS_PORT,
    password: REDIS_PASSWORD
  }));

  initSocket(io);
};

module.exports.getIO = () => {
  if (!io) { throw new Error("Socket not init!"); }
  return io;
};
