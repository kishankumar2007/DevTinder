const validator = require("validator");
const connectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

const validateSignup = (req) => {
  const { firstName, lastName, email, password} = req.body;

  if (!firstName || !lastName)
    throw new Error("Firstname and lastname is required");

  if (!email) throw new Error("Email is required");
  else if (!validator.isEmail(email)) throw new Error("Email is not valid");

  if (!password) throw new Error("Password is required");
  else if (!validator.isStrongPassword(password))
    throw new Error(
      "Password must contain letters, numbers and special characters"
    );
};

const validateEditData = (req) => {
  const allowedEditFields = [
    "firstName",
    "lastName",
    "age",
    "gender",
    "avatar",
    "skills",
    "about",
  ];

  const isEditAllowed = Object.keys(req.body).every((field) =>
    allowedEditFields.includes(field)
  );

  return isEditAllowed;
};


const validateConnectionRequest = async (req) => {
  const allowedConnectionRequest = ["interested", "ignore"];
  const status = req.params?.status;
  const toUserId = req.params?.userId;
  const fromUserId = req.user?._id

  const isUserPresentInDb = await User.findById(toUserId );

  const isConnectionRequestPresent = await connectionRequest.find({
    $or: [
      { toUserId, fromUserId },
      { fromUserId: toUserId, toUserId: fromUserId },
    ],
  });

  if (toUserId.toString() === fromUserId.toString()) throw new Error("Self Connection,Not allowed");

  if (!allowedConnectionRequest.includes(status))
    throw new Error(
      "Connection Request either can be intrested or ignore, Got: " + status);

  if (!isUserPresentInDb) throw new Error("User not found");

  if(isConnectionRequestPresent.length > 0) throw new Error("Connection request already exits.")



    return true
};

module.exports = { validateSignup, validateEditData, validateConnectionRequest };
