const express = require("express");
const AsyncHandler = require("express-async-handler");
const router = express.Router();
const Product = require("../models/Product");
const { protect, admin } = require("../midleware/authMidleware");

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

//@description Delete product
//@rotes DELETE /api/products/:id
//Admin
router.delete(
  "/:id",
  protect,
  admin,
  AsyncHandler(async (req, res) => {
    const product = await Product.findById(req.params.id);

    if (product) {
      await product.remove();
      res.json({ mesage: "Product removed" });
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

//@description Create product
//@rotes Post /api/products
//Admin
router.post(
  "/",
  protect,
  admin,
  AsyncHandler(async (req, res) => {
    const product = new Product({
      name: "sample",
      price: 0,
      user: req.user._id,
      image: "/images/sample.jpg",
      brand: "sample brand",
      category: "sample categ",
      countInStock: 0,
      numReviews: 0,
      description: "sample",
    });

    const createdProduct = await product.save();
    res.status(200).json(createdProduct);
  })
);

// @desc    Update a product
// @route   PUT /api/products/:id
// @access  Private/Admin
router.put(
  "/:id",
  protect,
  admin,
  AsyncHandler(async (req, res) => {
    const {
      name,
      price,
      description,
      image,
      brand,
      category,
      countInStock,
    } = req.body;

    const product = await Product.findById(req.params.id);

    if (product) {
      product.name = name;
      product.price = price;
      product.description = description;
      product.image = image;
      product.brand = brand;
      product.category = category;
      product.countInStock = countInStock;

      const updatedProduct = await product.save();
      res.json(updatedProduct);
    } else {
      res.status(404);
      throw new Error("Product not found");
    }
  })
);

module.exports = router;
