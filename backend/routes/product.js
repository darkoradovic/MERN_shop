const express = require("express");
const AsyncHandler = require("express-async-handler");
const router = express.Router();
const Product = require("../models/Product");
const Order = require("../models/Order");

//@description Fetch all products
//@rotes GET /api/products
router.get(
  "/",
  AsyncHandler(async (req, res) => {
    const products = await Product.find({});

    res.json(products);
  })
);

//@description Fetch product by id
//@rotes GET /api/products/:id
router.get(
  "/:id",
  AsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

module.exports = router;
