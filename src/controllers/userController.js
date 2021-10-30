const router = require("express").Router();
const auth = require("../middleware/auth");
const userBusiness = require("../businesses/userBusiness");
const multer = require("multer");
const upload = multer();

router.get("/search", auth, userBusiness.searchUser);

router.get("/user/:id", auth, userBusiness.getUser);

router.patch("/user", auth, userBusiness.updateUser);
router.patch("/user/avatar", upload.single("file"), auth, userBusiness.uploadAvatar);

router.patch("/user/:id/follow", auth, userBusiness.follow);
router.patch("/user/:id/unfollow", auth, userBusiness.unfollow);

router.get("/suggestionsUser", auth, userBusiness.suggestionsUser);

module.exports = router;
