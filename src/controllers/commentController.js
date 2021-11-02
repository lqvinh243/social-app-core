const router = require("express").Router();
const commentBusiness = require("../businesses/commentBusiness");
const auth = require("../middleware/auth");

router.post("/comment", auth, commentBusiness.createComment);

router.patch("/comment/:id", auth, commentBusiness.updateComment);

router.patch("/comment/:id/like", auth, commentBusiness.likeComment);

router.patch("/comment/:id/unlike", auth, commentBusiness.unLikeComment);

router.delete("/comment/:id", auth, commentBusiness.deleteComment);

module.exports = router;
