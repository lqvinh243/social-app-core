const Users = require("../models/userModel");
const Conversations = require("../models/conversationModel");
const Messages = require("../models/messageModel");

const userBusiness = {
  searchUser: async (req, res) => {
    try {
      const users = await Users.find({ fullname: { $regex: req.query.fullname } })
        .limit(10).select("fullname avatar");

      res.json({ users });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  getUser: async (req, res) => {
    try {
      const user = await Users.findById(req.params.id).select("-password")
        .populate("followers following", "-password");
      if (!user) return res.status(400).json({ msg: "User does not exist." });

      res.json({ user });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  updateUser: async (req, res) => {
    try {
      const {fullname,avatar, address, gender } = req.body;
      if (!fullname) return res.status(400).json({ msg: "Please add your full name." });

      await Users.findOneAndUpdate({ _id: req.user._id }, {
        fullname,avatar, address, gender
      });

      res.json({ msg: "Update Success!" });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  follow: async (req, res) => {
    try {
      const user = await Users.find({ _id: req.params.id, followers: req.user._id });
      if (user.length > 0) return res.status(500).json({ msg: "You followed this user." });

      const newUser = await Users.findOneAndUpdate({ _id: req.params.id }, {
        $push: { followers: req.user._id }
      }, { new: true }).populate("followers following", "-password");

      await Users.findOneAndUpdate({ _id: req.user._id }, {
        $push: { following: req.params.id }
      }, { new: true });

      const message = `Hi ${newUser.fullname}, nice to meet you!`;
      const sender = req.user._id;
      const recipient = req.params.id;

      const newConversation = await Conversations.findOneAndUpdate({
        $or: [
          { recipients: [sender, recipient] },
          { recipients: [recipient, sender] }
        ]
      }, {
        recipients: [sender, recipient],
        text: message
      }, { new: true, upsert: true });

      const newMessage = new Messages({
        conversation: newConversation._id,
        sender,
        recipient,
        text: message
      });

      await newMessage.save();

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  unfollow: async (req, res) => {
    try {
      const newUser = await Users.findOneAndUpdate({ _id: req.params.id }, {
        $pull: { followers: req.user._id }
      }, { new: true }).populate("followers following", "-password");

      await Users.findOneAndUpdate({ _id: req.user._id }, {
        $pull: { following: req.params.id }
      }, { new: true });

      res.json({ newUser });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  },
  suggestionsUser: async (req, res) => {
    try {
      const newArr = [...req.user.following, req.user._id];

      const num = req.query.num || 10;

      const users = await Users.aggregate([
        { $match: { _id: { $nin: newArr } } },
        { $sample: { size: Number(num) } },
        { $lookup: { from: "users", localField: "followers", foreignField: "_id", as: "followers" } },
        { $lookup: { from: "users", localField: "following", foreignField: "_id", as: "following" } }
      ]).project("-password");

      return res.json({
        users,
        result: users.length
      });
    } catch (err) {
      return res.status(500).json({ msg: err.message });
    }
  }
};

module.exports = userBusiness;
