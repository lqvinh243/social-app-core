const Ajvlib = require("ajv");

module.exports = (schema) => {
  return (req, res, next) => {
    const ajv = new Ajvlib({});

    const validate = ajv.compile(schema);
    const valid = validate(req.body);
    console.log(validate);
    if (!valid) {
      return res.status(400).json({
        msg: `${validate.errors[0].instancePath.replace("/", "")} ${validate.errors[0].message}`.trim()
      });
    }
    next();
  };
};
