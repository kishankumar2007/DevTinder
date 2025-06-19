const express = require("express");
require("dotenv").config();

const { adminAuth, userAuth } = require("./middleware/auth.Middleware");

const app = express();
const PORT = process.env.PORT || 3500;

app.use("/admin", adminAuth);

app.get("/admin/data", (req, res) => {
  res.send("Data send succesfully");
});
app.post("/login", (req, res) => {
  res.send("received user login");
});
app.get("/user/data", userAuth, (req, res) => {
  res.send("Send user succesfully");
});

app.listen(PORT, () => {
  console.log(`Server is listing on PORT ${PORT}`);
});
