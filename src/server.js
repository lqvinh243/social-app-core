const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const { ExpressPeerServer } = require("peer");
const { MONGODB_URL, PORT } = require("./config/index");
const morgan = require("morgan");
const { combineController } = require("./commom/index");
const { initSocketServer } = require("./service/socket/socketServer");

module.exports.start = (callback) => {
  const app = express();
  app.use(express.json());
  app.use(cors());

  app.use(morgan(function (tokens, req, res) {
    return [
      tokens.method(req, res),
      tokens.url(req, res),
      tokens.status(req, res),
      tokens.res(req, res, "content-length"), "-",
      tokens["response-time"](req, res), "ms"
    ].join(" ");
  }));

  const healthCheck = () => {
    const router = express.Router();
    router.get("/health", (req, res) => {
      res.json("Ok");
    });
    return router;
  };
  app.use("/", healthCheck());

  // Socket
  const http = require("http").createServer(app);
  initSocketServer(http);

  ExpressPeerServer(http, { path: "/" });
  combineController(app);

  mongoose.connect(MONGODB_URL, {
    useCreateIndex: true,
    useFindAndModify: false,
    useNewUrlParser: true,
    useUnifiedTopology: true
  }, err => {
    if (err) throw err;
    console.log("Connected to mongodb");
  });

  return http.listen(PORT, callback);
};
