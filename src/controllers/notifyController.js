const router = require("express").Router();
const auth = require("../middleware/auth");
const notifyBusiness = require("../businesses/notifyBusiness");

router.post("/notify", auth, notifyBusiness.createNotify);

router.delete("/notify/:id", auth, notifyBusiness.removeNotify);

router.get("/notifies", auth, notifyBusiness.getNotifies);

router.patch("/isReadNotify/:id", auth, notifyBusiness.isReadNotify);

router.delete("/deleteAllNotify", auth, notifyBusiness.deleteAllNotifies);

module.exports = router;
