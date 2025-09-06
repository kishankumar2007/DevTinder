const express = require("express");
const User = require("../models/user");
const bcrypt = require("bcrypt");
const { validateSignup } = require("../utils/validations");
const { userAuth } = require("../middleware/auth.Middleware");
// const { sendOtp, greetUser } = require("../utils/sendMail")
const Otp = require("../models/OtpVerification")

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
  try {
    validateSignup(req);
    const { firstName, lastName, email, password } = req.body;
    const verifiedUser = await Otp.findOne({ email })

    if (!verifiedUser || !verifiedUser.isVerified) throw Error("Verify your email.")

    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({
      firstName,
      lastName,
      email,
      isVerified: true,
      password: passwordHash,
    });

    const response = await user.save();
    await greetUser(response.firstName, response.email)
    await Otp.findByIdAndDelete(verifiedUser._id)
    res.json({ status: 200, message: "Registered Successful", data: response });
  } catch (error) {
    console.log(error.message)
    res.status(400).json({
      message: error.message
    });
  }
});


//it's working in local server but it's failing due to backend hosted on free server.

authRouter.post("/send-otp", async (req, res) => {
  try {
    const { email } = req.body
    const genOtp = await sendOtp(email)
    const userOtp = new Otp({ email, otp: genOtp, expiry: new Date(Date.now() + 5 * 60 * 1000) })
    const response = await userOtp.save()
    if (response) res.status(200).json({ message: "Otp send successfully." })
  } catch (error) {
    console.log(error.message)
    res.json({ status: 400, message: error.message })
  }
})


authRouter.post("/verify-otp", async (req, res) => {
  try {
    const { email, userOtp } = req.body
    const OTP = await Otp.findOne({ email, otp: userOtp })

    if (!OTP) {
      return res.status(401).json({ message: "Invalid Otp" })
    }

    if (OTP?.expiry < Date.now()) {
      return res.status(400).json({ message: "Otp has been expired." })
    }

    await Otp.findOneAndUpdate({ email, otp: userOtp }, { isVerified: true })

    res.status(200).json({ message: "Otp verified successfully." })
  } catch (error) {
    console.log(error.message)
    res.json({ status: 400, message: error.message })
  }
})


authRouter.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email: email })

    if (!user) throw new Error("Email or Password is invalid");
    const isPasswordValid = await user.validatePassword(password);

    if (isPasswordValid) {
      const token = user.getJWT();

      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
        sameSite: "none",
        expires: new Date(Date.now() + 24 * 3600000),
      });


      res.status(200).json({
        status: 200,
        message: "Login Success",
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
    res.status(400).json({ status: 400, message: error.message });
  }
});

authRouter.post("/logout", userAuth, async (req, res) => {
  try {
    res.cookie("token", null, {
      httpOnly: true,
      secure: true,
      sameSite: "none",
      expires: Date.now(),
    });
    res.json("Logout Successful");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = authRouter;
