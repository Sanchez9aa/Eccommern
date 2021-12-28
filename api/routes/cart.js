const router = require("express").Router();
const {
  tokenVerify,
  authVerify,
} = require("../models/middlewares/tokenVerify");
const Cart = require("../models/Cart");

/* Create a cart */
router.post("/", tokenVerify, async (req, res) => {
  const newCart = new Cart(req.body);
  try {
    const savedProduct = await newCart.save();
    res.status(200).send({ savedProduct, success: true });
  } catch (err) {
    res.status(500).send({ message: `${err}`, success: false });
  }
});

/* Modify a cart */
router.put("/:id", tokenVerify, async (req, res) => {
  try {
    const updatedCart = await Cart.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
		console.log(updatedCart)
    res.status(200).send({ updatedCart, success: true });
  } catch (err) {
    res.status(500).send({ message: `${err}`, success: false });
  }
});

/* Delete a cart */
router.delete("/:id", tokenVerify, async (req, res) => {
  const cartId = req.params.id;
  try {
    const cart = await Cart.findByIdAndDelete({ _id: cartId });
		if(cart) return res.status(200).json({ message: "Cart has been deleted", success: true }); 
    else return res.status(400).json({ message: "No one cart has been found", success: true });
  } catch (err) {
    res.status(500).json({ message: `${err}`, success: false });
  }
});

/* Get a cart */
router.get("/:userId", tokenVerify, async (req, res) => {
  try {
    const cart = await Cart.find({ userId: req.params.userId });
    res.status(200).send({ cart, success: true });
  } catch (err) {
    res.status(500).send({ message: `${err}`, success: false });
  }
});

/* Get all carts */
router.get("/", authVerify, async (req, res) => {
  try {
    const carts = await Cart.find();
    res.status(200).send({ carts, success: true });
  } catch (err) {
    res.status(500).send({ message: `${err}`, success: false });
  }
});

module.exports = router;
