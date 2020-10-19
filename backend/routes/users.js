const express = require("express");
const AsyncHandler = require("express-async-handler");
const router = express.Router();
const User = require("../models/User");
const { generateToken } = require("../utils/generateToken");
const { protect } = require("../midleware/authMidleware");

//@description Auth user and get token
//@rotes POST api/users/login
router.post(
  "/login",
  AsyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email: email });
    if (user && (await user.matchPassword(password))) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        isAdmin: user.isAdmin
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  })
);

//@description Register user
//@rotes POST api/users
router.post(
  "/",
  AsyncHandler(async (req, res) => {
    const { email, password, name } = req.body;

    const userExists = await User.findOne({ email: email });
    if (userExists) {
      res.status(400);
      throw new Error("User exists");
    }

    const user = await User.create({
      name,
      email,
      password
    });

    if (user) {
      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        isAdmin: user.isAdmin
      });
    } else {
      res.status(400);
      throw new Error("Invalid user data");
    }
  })
);

//@description Get user profile
//@rotes GET api/users/profile
router.get(
  "/profile",
  protect,
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        isAdmin: user.isAdmin
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

//@description Update user profile
//@rotes PUT api/users/profile
router.put(
  "/profile",
  protect,
  AsyncHandler(async (req, res) => {
    const user = await User.findById(req.user._id);

    if (user) {
      user.name = req.body.name || user.name;
      user.email = req.body.email || user.email;
      if (req.body.password) {
        user.password = req.body.password;
      }

      const updatedUser = await user.save();
      res.json({
        _id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        token: generateToken(updatedUser._id),
        isAdmin: updatedUser.isAdmin
      });
    } else {
      res.status(404);
      throw new Error("User not found");
    }
  })
);

module.exports = router;
