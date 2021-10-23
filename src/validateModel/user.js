module.exports.userValidate = {
  userCreate: {
    type: "object",
    properties: {
      fullname: { type: "string" },
      email: { type: "string" },
      password: { type: "string" },
      gender: { type: "string" },
      address: { type: "string" }
    },
    required: ["fullname", "email", "password"],
    additionalProperties: true
  },
  userLogin: {
    type: "object",
    properties: {
      email: { type: "string" },
      password: { type: "string" }
    },
    required: ["email", "password"],
    additionalProperties: true
  }
};
