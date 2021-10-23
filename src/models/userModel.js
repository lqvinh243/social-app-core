const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  fullname: {
    type: String,
    required: true,
    trim: true,
    maxlength: 25
  },
  email: {
    type: String,
    required: true,
    trim: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  avatar: {
    type: String,
    default: "https://res.cloudinary.com/devatchannel/image/upload/v1602752402/avatar/avatar_cugq40.png"
  },
  role: { type: String, default: "user" },
  gender: { type: String, default: "male" },
  address: { type: String, default: "" },
  followers: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  following: [{ type: mongoose.Types.ObjectId, ref: "user" }],
  saved: [{ type: mongoose.Types.ObjectId, ref: "user" }]
}, {
  timestamps: true
});

module.exports = mongoose.model("user", userSchema);
