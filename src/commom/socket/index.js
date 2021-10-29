const io = require("../../service/socket/socketServer").getIO();
module.exports.send = (namespace, eventSocket, room, data) => {
  const event = "new_chat";
  io.of("/" + namespace).to(room).emit(event, data);
};
