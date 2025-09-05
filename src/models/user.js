const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 25,
      trim: true,
    },
    lastName: {
      type: String,
      minLength: 3,
      maxLength: 25,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: [true, "User is already registered with this email"],
      minLength: 5,
      maxLength: 30,
      lowerecase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
    },
    age: {
      type: Number,
      min: [13, "Kid's are not allowed"],
      max: [50, "GrandFather's are not allowed"],
    },
    gender: {
      type: String,
      enum: {
        values: ["male", "female", "other"],
        message: "${VALUE} is not incorrect"
      }
    },
    skills: {
      type: [String],
      trim: true,
    },
    about: {
      type: String,
      minLength: 5,
      maxLength: 100,
      default: "this is a dummy about",
      trim: true,
    },

    avatar: {
      type: Object,
      default: "https://shorturl.at/p5yLy",
    },
    public_Id: {
      type: String
    },
    isVerified:{
      type: Boolean,
      default: false
    }
  },

  { timestamps: true }
);

userSchema.methods.getJWT = function () {
  const user = this;
  const token = jwt.sign({ _id: user._id }, process.env.JWT_SECKRET_KEY);

  return token;
};

userSchema.methods.validatePassword = async function (userInputPassword) {
  const user = this;
  const isPasswordValid = await bcrypt.compare(
    userInputPassword,
    user.password
  );

  if (isPasswordValid) {
    return isPasswordValid;
  } else {
    throw new Error("Invalid credentials, try again");
  }
};

module.exports = mongoose.model("User", userSchema);
