module.exports.commentValidate = {
  commentCreate: {
    type: "object",
    properties: {
      content: { type: "string" }
    },
    required: ["content"],
    additionalProperties: true
  }
};
