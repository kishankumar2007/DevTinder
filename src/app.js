const express = require("express");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3500;

app
  .get(
    "/user",
    (req, res, next) => {
      console.log("First res send..");
      next();
      //res.send("Hello World") //we will get an error
    },
    (req, res, next) => {
      console.log("response from the 2nd route handler");
      //res.send("response from the 2nd route handler")
      next(); //error cannot get /user
    }
  )
  .post("/user", (req, res, next) => {
    res.send("Res from POST");
    next();
  });

app.listen(PORT, () => {
  console.log(`Server is listing on ${PORT}`);
});
