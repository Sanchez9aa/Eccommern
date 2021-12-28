const router = require("express").Router();
const {
  tokenVerify,
  authVerify,
} = require("../models/middlewares/tokenVerify");
const Order = require("../models/Order");

/* Create an order */
router.post("/", tokenVerify, async (req, res) => {
  const newOrder = new Order(req.body);
  try {
    const savedOrder = await newOrder.save();
    res.status(200).send({ savedOrder, success: true });
  } catch (err) {
    res.status(500).send({ message: `${err}`, success: false });
  }
});

/* Modify an order */
router.put("/:id", authVerify, async (req, res) => {
  try {
    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send({ updatedOrder, success: true });
  } catch (err) {
    res.status(500).send({ message: `${err}`, success: false });
  }
});

/* Delete an order */
router.delete("/:id", authVerify, async (req, res) => {
  const orderId = req.params.id;
  try {
    const order = await Order.findByIdAndDelete({ _id: productId });
    res
      .status(200)
      .json({ message: "Product has been deleted", success: true });
  } catch (err) {
    res.status(500).json({ message: `${err}`, success: false });
  }
});

/* Get an order */
router.get("/:userId", authVerify, async (req, res) => {
  try {
    const order = await Order.find({ userId: req.params.userId });
    res.status(200).send({ order, success: true });
  } catch (err) {
    res.status(500).send({ message: `${err}`, success: false });
  }
});

/* Get all orders */
router.get("/", authVerify, async (req, res) => {
  try {
    const orders = await Order.find();
    res.status(200).send({ orders, success: true });
  } catch (err) {
    res.status(500).send({ message: `${err}`, success: false });
  }
});

/* Get monthly income */
router.get("/income", authVerify, async (req, res) => {
  const lastMonth = new Date(date.setMonth(date.getMonth() - 1));
  try {
    const income = await Order.aggregate([
      {
        $match: { createdAt: { $gte: lastMonth } },
      },
      {
        $project: {
          month: { $month: "$createdAt" },
          sales: "$amount",
        },
      },
      {
        $group: {
          _id: "$month",
          total: { $sum: "$sales" },
        },
      },
    ]);
    res.status(200).send({ income, success: true });
  } catch (err) {
    res.status(500).send({ message: `${err}`, success: false });
  }
});
module.exports = router;
