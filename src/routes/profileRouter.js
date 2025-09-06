const express = require("express");
const { userAuth } = require("../middleware/auth.Middleware");
const { validateEditData } = require("../utils/validations");
const bcrypt = require("bcrypt");
const validator = require("validator");
const { upload } = require("../middleware/multer.Middleware");
const { uploadOnCloudinary, deleleteFromCloudinary } = require("../utils/cloudnary");

const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, (req, res) => {
  try {
    const user = req.user;
    res.json(user);
  } catch (error) {
    res.status(400).json(error.message);
  }
});

profileRouter.patch("/profile/edit", userAuth, upload.fields([
  {
    name: "avatar",
    maxCount: 1
  }
]), async (req, res) => {
  try {

    let loggedInUser = req.user;

    const isEditAllowed = validateEditData(req);

    if (!isEditAllowed) throw new Error("Input Fields are invalid");

    if (req.files.avatar) {
      const localFilePath = req.files?.avatar[0]?.path
      const response = await uploadOnCloudinary(localFilePath)
      const res = await deleleteFromCloudinary(loggedInUser?.public_Id)
      loggedInUser["avatar"] = response.url
      loggedInUser['public_Id'] = response.fileId
    }

    loggedInUser["avatar"] = loggedInUser.avatar

    Object.keys(req.body).forEach((key) => (loggedInUser[key] = req.body[key]));

    await loggedInUser.save();

    res.json({ message: "Profile updated successfully", user: loggedInUser });
  } catch (error) {
    res.status(400).json(error.message);
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
    res.json("Password changed successfully");
  } catch (error) {
    res.status(400).json(error.message);
  }
});

module.exports = profileRouter;
