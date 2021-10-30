const io = require("../../service/socket/socketServer").getIO();
module.exports.send = (namespace, eventSocket, room, data) => {
  io.of("/" + namespace).to(room).emit(eventSocket, data);
};
