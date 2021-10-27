const router = require("express").Router();
const authBusiness = require("../businesses/authBusiness");
const validateModel = require("../middleware/validateModel");
const { userValidate } = require("../validateModel/user");

router.post("auths/register", validateModel(userValidate.userCreate), authBusiness.register);

router.post("auths/login", validateModel(userValidate.userLogin), authBusiness.login);

router.post("auths/verify-capcha", authBusiness.verifyCapcha);

module.exports = router;
