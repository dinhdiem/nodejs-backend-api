const Order = require("../models/Order");
const {
  verifyToken,
  verifyTokenAndAuthorization,
  verifyTokenAndisAdmin,
} = require("./verifyToken");
const CryptoJS = require("crypto-js");

const router = require("express").Router();

//CREATE PRODUCT

router.post("/", verifyToken, async (req, res) => {
  const newOrder = await Order(req.body);

  try {
    const saveOrder = await newOrder.save();
    res.status(200).json(saveOrder);
  } catch (error) {
    res.status(500).json(error);
  }
});

//Update
router.put("/:id", verifyTokenAndisAdmin, async (req, res) => {
  try {
    const updateOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).json(updateOrder);
  } catch (error) {
    res.status(400).json(err);
  }
});

//DELETE
router.delete("/:id", verifyTokenAndisAdmin, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.status(200).json("Xóa order thành công!");
  } catch (error) {
    console.log(error);
  }
});

// //GET

router.get("/:userId", verifyTokenAndAuthorization, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId });
    res.status(200).json(orders);
  } catch (error) {
    console.log(error);
  }
});

// Get All
router.get("/", verifyTokenAndisAdmin, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(201).json(orders);
  } catch (e) {
    res.status(400).json(e);
  }
});

module.exports = router;
