const express = require("express");
const { connectDB } = require("./config/db");
const cookieParser = require("cookie-parser");
const profileRouter = require("./routes/profileRouter");
const requestRouter = require("./routes/requestRouter");
const authRouter = require("./routes/authRouter");
const userRouter = require("./routes/userRouter");
const cors = require("cors");
const paymentRouter = require("./routes/payment");

require("dotenv").config();
const app = express();
const PORT = process.env.PORT || 3500;

app.use(cors({
  origin: 'https://devtinder-dev.vercel.app',
  credentials: true
}))
app.use(express.json());
app.use(cookieParser());


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);
app.use("/", paymentRouter)

connectDB().then((dbConnection) => {
  if (dbConnection) {
    app.listen(PORT, () => {
      console.log(`Server is listing on PORT ${PORT}`);
    });
  }
});


