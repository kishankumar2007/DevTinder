const express = require("express");
const { connectDB } = require("./config/db");
const { validateSignup } = require("./utils/validations");
const User = require("./Models/user");
const bcrypt = require("bcrypt");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());

app.post("/signup", async (req, res) => {
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
    res.send("User Registred", response);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email });
    if (!user) throw new Error("Email or Password is invalid");
    const isValid = await bcrypt.compare(password, user.password);
    if (isValid) {
      res.send("Login Success");
    } else {
      throw new Error("Email or Password is invalid");
    }
  } catch (error) {
    res.status(400).send(error.message);
  }
});

connectDB()
  .then(() =>
    app.listen(PORT, () => {
      console.log(`Server is listing on PORT ${PORT}`);
    })
  )
  .catch((err) => console.log(err.message));
