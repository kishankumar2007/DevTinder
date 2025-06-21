const express = require("express");
const { userAuth } = require("../middleware/auth.Middleware");
const requestRouter = express.Router();

requestRouter.post("/connectionRequest", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.send(`${user.firstName} has sent the request`);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

module.exports = requestRouter