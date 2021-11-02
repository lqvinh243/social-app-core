const router = require("express").Router();
const messageBusiness = require("../businesses/messageBusiness");
const auth = require("../middleware/auth");

router.post("/message", auth, messageBusiness.createMessage);

router.get("/conversations", auth, messageBusiness.getConversations);

router.get("/message/:id", auth, messageBusiness.getMessages);

router.delete("/message/:id", auth, messageBusiness.deleteMessages);

router.delete("/conversation/:id", auth, messageBusiness.deleteConversation);

module.exports = router;
