const express = require("express");
const { connectDB } = require("./config/db");
const User = require("./Models/user");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3500;

app.use(express.json());

app.get("/feed", async (req, res) => {
  try {
    const user = await User.find(req.body);
    if (user.length === 0) res.status(404).send("No user found");
    res.send(user);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

app.delete("/user", async (req, res) => {
  try {
    console.log(req.body.userId);
    const user = await User.findByIdAndDelete(req.body.userId);
    console.log(user);
    if (user) {
      res.send("User has been deleted succesfully...");
    } else {
      throw new Error("No user found");
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
});

app.patch("/update", async (req, res) => {
  try {
    console.log(req.body);
    const user = await User.findOneAndUpdate(
      { email: req.body.email },
      req.body
    );
    if (user) {
      res.send("User updated successfuly");
    } else {
      throw new Error("failed to update due to invalid info");
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
});

app.get("/userId", async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    if (user) {
      console.log(user);
      res.send(user);
    } else {
      throw new Error("No user found");
    }
  } catch (error) {
    console.log(error.message);
    res.status(400).send(error.message);
  }
});

app.post("/signup", async (req, res) => {
  const user = new User(req.body);
  try {
    const response = await user.save();
    res.send("User Registred", response);
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
