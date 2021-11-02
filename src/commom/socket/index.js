const io = require("../../service/socket/socketServer").getIO();
module.exports.sendRoom = (namespace, eventSocket, room, data) => {
  io.of("/" + namespace).to(room).emit(eventSocket, data);
};

module.exports.sendNsp = (namespace, eventSocket, data) => {
  io.of("/" + namespace).emit(eventSocket, data);
};
