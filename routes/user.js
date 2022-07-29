const User = require("../models/User");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndisAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");

const router = require("express").Router();

//UPDATE USER
router.put("/:id", verifyTokenAndAuthorization, async (req, res) => {
  if (req.body.password) {
    req.body.password = CryptoJS.AES.encrypt(
      req.body.password,
      process.env.PASS_SEC
    ).toString();
  }
  try {
    const updateUser = await User.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateUser);
  } catch (error) {
    res.status(400).json(err);
  }
});

//DELETE User
router.delete("/:id", verifyTokenAndisAdmin, async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.status(200).json("Xóa User thành công!");
  } catch (error) {
    console.log(error);
  }
});

//GET User

router.get("/:id", verifyTokenAndisAdmin, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    const { password, ...others } = user._doc;
    res.status(200).json(others);
  } catch (error) {
    console.log(error);
  }
});

router.get("/", verifyTokenAndisAdmin, async (req, res) => {
  const query = req.query.new;
  try {
    const users = query ? User.find().sort(-1).limit() : await User.find();
    res.status(200).json(users);
  } catch (error) {
    console.log(error);
  }
});

module.exports = router;
