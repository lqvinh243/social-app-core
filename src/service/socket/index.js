const { readdirSync } = require("fs");
const path = require("path");
const channels = readdirSync(path.join(process.cwd(), "/src/service/socket/channels"));

module.exports.initSocket = (io) => {
  channels.forEach(channel => {
    require(path.join(process.cwd(), `/src/service/socket/channels/${channel}`)).initChannel(io);
  });
};
