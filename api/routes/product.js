const router = require("express").Router();
const { authVerify } = require("../models/middlewares/tokenVerify");
const Product = require("../models/Product");

/* Create a product */
router.post("/", authVerify, async (req, res) => {
  const newProduct = new Product(req.body);
  try {
    const savedProduct = await newProduct.save();
    res.status(200).send({ savedProduct, success: true });
  } catch (err) {
    res.status(500).send({ message: `${err}`, success: false });
  }
});

/* Modify a product */

router.put("/:id", authVerify, async (req, res) => {
  try {
    const updatedProduct = await Product.findByIdAndUpdate(
      req.params.id,
      {
        $set: req.body,
      },
      { new: true }
    );
    res.status(200).send({ updatedProduct, success: true });
  } catch (err) {
    res.status(500).send({ message: `${err}`, success: false });
  }
});

/* Delete a product */

router.delete("/:id", authVerify, async (req, res) => {
  const productId = req.params.id;
  try {
    const product = await Product.findByIdAndDelete({ _id: productId });
    res
      .status(200)
      .json({ message: "Product has been deleted", success: true });
  } catch (err) {
    res.status(500).json({ message: `${err}`, success: false });
  }
});

/* Get all products */

router.get("/", authVerify, async (req, res) => {
  const query = req.query.product;
  const queryC = req.query.category;
	console.log(queryC)
  try {
    let products;
    if (query) {
      products = await Product.find().sort({ createdAt: -1 }).limit(5);
    } else if (queryC) {
      products = await Product.find({
        categories: {
          $in: [queryC],
        },
      });
			console.log(products)
    } else {
      products = await Product.find();
    }
    res.status(200).json({ products, success: true });
  } catch (err) {
    res.status(500).json({ message: `${err}`, success: false });
  }
});

module.exports = router;
