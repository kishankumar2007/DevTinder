const express = require("express");
const { connectDB } = require("./config/db");
const User = require("./Models/user");
require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3500;

const userData = {
  firstName: "Kishan",
  lastName: "Kumar",
  email: "kishan2@gmail.com",
  password: "Kishan@098",
  age: 21,
  gender: "male",
};

app.post("/signup", async (req, res) => {
  const user = new User(userData);
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
