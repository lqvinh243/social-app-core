const router = require("express").Router();
const authBusiness = require("../businesses/authBusiness");
const validateModel = require("../middleware/validateModel");
const { userValidate } = require("../validateModel/user");
const auth = require("../middleware/auth");

router.post("/auths", authBusiness.verifyToken);

router.post("/auths/register", validateModel(userValidate.userCreate), authBusiness.register);

router.post("/auths/login", validateModel(userValidate.userLogin), authBusiness.login);

router.post("/auths/verify-capcha", authBusiness.verifyCapcha);

router.post("/auths/logout", authBusiness.logout);

router.post("/auths/refreshtoken", authBusiness.generateAccessToken);

router.post("/auths/resetpassword", auth, authBusiness.resetPassword);

module.exports = router;
