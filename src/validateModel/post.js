module.exports.postValidate = {
  postCreate: {
    type: "object",
    properties: {
      content: { type: "string" }
    },
    required: ["content"],
    additionalProperties: true
  }
};
