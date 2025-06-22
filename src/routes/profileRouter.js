const express = require("express");
const { userAuth } = require("../middleware/auth.Middleware");
const { validateEditData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const validator = require("validator");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.json({ message: user });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;
    const isEditAllowed = validateEditData(req);

    if (!isEditAllowed) throw new Error("Input Fields are invalid");

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();
    res.json({
      message: "Profile updated successfully",
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

profileRouter.patch("/profile/updatepassword", userAuth, async (req, res) => {
  try {
    const user = req.user;
    const isNewPasswordValid = validator.isStrongPassword(req.body.newPassword);

    if (!isNewPasswordValid)
      throw new Error(
        "Password must contain letters, numbers and special characters"
      );

    const isPasswordValid = await user.validatePassword(req.body?.oldPassword);

    if (isPasswordValid) {
      const passwordHash = await bcrypt.hash(req.body.newPassword, 10);
      user.password = passwordHash;

      await user.save();
    }
    res.json({ message: "Password changed successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

module.exports = profileRouter;
