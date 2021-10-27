const { readdirSync } = require("fs");
const path = require("path");
const controllers = readdirSync(path.join(process.cwd(), "/src/controllers"));

module.exports.combineController = (app) => {
  controllers.forEach(controller => {
    app.use("api/v1", require(path.join(process.cwd(), `/src/controllers/${controller}`)));
  });
};
