const router = require("express").Router();
const User = require("../models/User");
const CryptoJS = require("crypto-js");
const jwt = require("jsonwebtoken");

//Register
router.post("/register", async (req, res) => {
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

router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ username: req.body.username });
    if (!user) {
      res.status(401).json({ message: "Tên đăng nhập không tồn tại" });
    }

    const hashedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.PASS_SEC
    );

    const originalPassword = hashedPassword.toString(CryptoJS.enc.Utf8);

    originalPassword !== req.body.password &&
      res.status(401).json({ message: "Mật khẩu không chính xác" });

    const { password, ...orthor } = user._doc;

    const acssetsToken = jwt.sign(
      { id: user._id, isAdmin: user.isAdmin },
      process.env.JWT_SEC,
      { expiresIn: "1d" }
    );
    res.status(200).json({ ...orthor, acssetsToken });
  } catch (error) {
    res.status(500).json({ message: "Lỗi: " });
  }
});

module.exports = router;
