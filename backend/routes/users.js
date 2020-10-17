const express = require("express");
const AsyncHandler = require("express-async-handler");
const router = express.Router();
const User = require("../models/User");

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
        isAdmin: user.isAdmin,
        token: null
      });
    } else {
      res.status(401);
      throw new Error("Invalid email or password");
    }
  })
);

module.exports = router;
