const Users = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { ACCESS_TOKEN_SECRET, REFRESH_TOKEN_SECRET } = require("../config/index");
const { siteVerify } = require("../service/capcha");

const authBusiness = {
  register: async (req, res) => {
    try {
      const { fullname, email, password, gender } = req.body;

      const userEmail = await Users.findOne({ email });
      if (userEmail) return res.status(400).json({ msg: "This email already exists." });

      if (password.length < 6) { return res.status(400).json({ msg: "Password must be at least 6 characters." }); }

      const passwordHash = await bcrypt.hash(password, 12);

      const newUser = new Users({
        fullname, email, password: passwordHash, gender
      });

      const accessToken = createAccessToken({ id: newUser._id });

      await newUser.save();

      res.json({
        msg: "Register Success!",
        token: accessToken,
        user: {
          ...newUser._doc,
          password: ""
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  login: async (req, res) => {
    try {
      const { email, password } = req.body;

      const user = await Users.findOne({ email })
        .populate("followers following", "avatar fullname followers following");

      if (!user) return res.status(400).json({ msg: "This email does not exist." });

      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) return res.status(400).json({ msg: "Password is incorrect." });

      const accessToken = createAccessToken({ id: user._id });
      const refreshtoken = createRefreshToken({ id: user._id });

      res.cookie("refreshtoken", refreshtoken, {
        httpOnly: true,
        path: "/api/v1/auths/refreshtoken",
        maxAge: 30 * 24 * 60 * 60 * 1000 // 30days
      });

      res.json({
        msg: "Login Success!",
        token: accessToken,
        user: {
          ...user._doc,
          password: ""
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  logout: async (req, res) => {
    try {
      res.clearCookie("refreshtoken", { path: "/api/v1/auths/refreshtoken" });
      return res.json({ msg: "Logoged out" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  generateAccessToken: async (req, res) => {
    try {
      const refreshToken = req.cookies.refreshtoken;
      if (!refreshToken) return res.status(400).json({ msg: "Please login now." });

      jwt.verify(refreshToken, process.env.refreshToken_SECRET, async (err, result) => {
        if (err) return res.status(400).json({ msg: "Please login now." });

        const user = await Users.findById(result.id).select("-password")
          .populate("followers following", "avatar fullname followers following");

        if (!user) return res.status(400).json({ msg: "This does not exist." });

        const accessToken = createAccessToken({ id: result.id });

        res.json({
          token: accessToken,
          user
        });
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  resetPassword: async (req, res) => {
    try {
      const { oldPass, newPass } = req.body;
      const user = await Users.findOne(req.user._id);
      if (!user) {
        return res.status(400).json({ msg: "This does not exist." });
      }
      if (!bcrypt.compareSync(oldPass, user.password)) {
        return res.status(400).json({ msg: "Password not match." });
      }
      const passwordHash = await bcrypt.hash(newPass, 12);
      await Users.findOneAndUpdate({ _id: req.user._id }, {
        password: passwordHash
      });
      res.json({ msg: "Reset Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  verifyCapcha: async (req, res) => {
    const { response } = req.body;
    res.json(await siteVerify(response));
  },
  verifyToken: async (req, res) => {
    try {
      const { token } = req.body;

      if (!token) return res.status(400).json({ msg: "Invalid Authentication." });

      const decoded = jwt.verify(token, ACCESS_TOKEN_SECRET);
      if (!decoded) return res.status(400).json({ msg: "Invalid Authentication." });

      const user = await Users.findOne({ _id: decoded.id })
        .populate("followers following", "avatar fullname followers following");

      if (!user) return res.status(400).json({ msg: "This email does not exist." });
      const accessToken = createAccessToken({ id: user._id });
      res.json({
        msg: "Auth Success!",
        token: accessToken,
        user: {
          ...user._doc,
          password: ""
        }
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};

const createAccessToken = (payload) => {
  return jwt.sign(payload, ACCESS_TOKEN_SECRET, { expiresIn: "1d" });
};

const createRefreshToken = (payload) => {
  return jwt.sign(payload, REFRESH_TOKEN_SECRET, { expiresIn: "30d" });
};
module.exports = authBusiness;
