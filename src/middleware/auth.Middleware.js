const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Please signin first");
    const decoded = jwt.verify(token, process.env.JWT_SECKRET_KEY);
    const _id = decoded?._id;

    const user = await User.findById(_id);
    
    if (user.isPremium && user.membershipExpiry < new Date()) {
      user.isPremium = false;
      user.membershipType = "free";
      await user.save();
    }
    req.user = user;
    next();
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

module.exports = { userAuth };
