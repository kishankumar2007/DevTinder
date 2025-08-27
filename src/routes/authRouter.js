const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignup } = require("../utils/validations");
const { userAuth } = require("../middleware/auth.Middleware");

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignup(req);
    const { firstName, lastName, email, password } = req.body;

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      password: passwordHash,
    });

    const response = await user.save();
    res.json("Registered Successful", response);
  } catch (error) {
    res.json({
      status: 400,
      message: error.message
    });
  }
});

authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email })
    if (!user) throw new Error("Email or Password is invalid");
    const isPasswordValid = await user.validatePassword(password);
    if (isPasswordValid) {
      const token = user.getJWT();

      res.cookie("token", token, {
        expires: new Date(Date.now() + 24 * 3600000),
      });

      res.status(200).json({
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          age: user.age,
          gender: user.gender,
          skills: user.skills,
          about: user.about,
          avatar: user.avatar
        }
      });
    }

  } catch (error) {
    console.log(error.message)
    res.json({status: 400,message:error.message});
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
    });

    res.json("Logout Successful");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = authRouter;
