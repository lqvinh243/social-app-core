const router = require("express").Router();
const postBusiness = require("../businesses/postBusiness");
const auth = require("../middleware/auth");
const multer = require("multer");
const upload = multer();

router.route("/posts")
  .post(auth, upload.any(), postBusiness.createPost)
  .get(auth, postBusiness.getPosts);

router.route("/post/:id")
  .patch(auth, postBusiness.updatePost)
  .get(auth, postBusiness.getPost)
  .delete(auth, postBusiness.deletePost);

router.patch("/post/:id/like", auth, postBusiness.likePost);

router.patch("/post/:id/unlike", auth, postBusiness.unLikePost);

router.get("/user_posts/:id", auth, postBusiness.getUserPosts);

router.get("/post_discover", auth, postBusiness.getPostsDicover);

router.patch("/savePost/:id", auth, postBusiness.savePost);

router.patch("/unSavePost/:id", auth, postBusiness.unSavePost);

router.get("/getSavePosts", auth, postBusiness.getSavePosts);

module.exports = router;
