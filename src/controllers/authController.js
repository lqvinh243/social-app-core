const router = require("express").Router();
const authBusiness = require("../businesses/authBusiness");
const validateModel = require("../middleware/validateModel");
const { userValidate } = require("../validateModel/user");

router.post("/register", validateModel(userValidate.userCreate), authBusiness.register);

router.post("/login", validateModel(userValidate.userLogin), authBusiness.login);

router.post("/refresh_token", authBusiness.generateAccessToken);

module.exports = router;
