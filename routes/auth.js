const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");

//Register
router.post("/auth/register", async (req, res) => {
  const { username, email } = req.body;
  const checkName = await User.findOne({ username }).exec();
  const checkMail = await User.findOne({ email }).exec();
  if (checkName) {
    return res.status(400).json({
      message: "Username đã tồn tại",
    });
  }
  if (checkMail) {
    return res.status(400).json({
      message: "Email đã tồn tại",
    });
  }
  const newUser = new User({
    username: req.body.username,
    email: req.body.email,
    password: CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString(),
  });
  try {
    const savedUser = await newUser.save();
    res.status(201).json(savedUser);
  } catch (error) {
    res.status(500).json(err);
  }
});

module.exports = router;
