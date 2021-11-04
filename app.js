const server = require("./src/server");
const cluster = require("cluster");
const { cpus } = require("os");
const process = require("process");
const numCPUs = 3 || cpus().length;

if (cluster.isMaster) {
  console.log(`Primary ${process.pid} is running`);

  for (let i = 0; i < numCPUs; i++) {
    cluster.fork();

    cluster.on("exit", (worker) => {
      cluster.fork();
      console.log(`worker ${worker.process.pid} died`);
    });
  }
} else {
  server.start(() => { console.log("Service api start"); });

  console.log(`Worker ${process.pid} started`);
}
