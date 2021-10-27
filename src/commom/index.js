const { readdirSync } = require("fs");
const path = require("path");
const controllers = readdirSync(path.join(process.cwd(), "/src/controllers"));

module.exports.combineController = (app) => {
  controllers.forEach(controller => {
    app.use("v1/api", require(path.join(process.cwd(), `/src/controllers/${controller}`)));
  });
};
