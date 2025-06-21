const jwt = require("jsonwebtoken");
const User = require("../Models/user");

const userAuth = async (req, res, next) => {
  try {
    const { token } = req.cookies;
    if (!token) throw new Error("Please signin again");
    const _id = jwt.verify(
      token,
      process.env.JWT_SECKRET_KEY,
      (err, decoded) => {
        if (err) throw new Error("User not found");
        return decoded?._id;
      }
    );
    
    const user = await User.findById(_id);
    req.user  = user;
    next();
  } catch (error) {
    res.status(400).send(error.message);
  }
};

module.exports = { userAuth };
