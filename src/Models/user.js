const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
    },
    lastName: {
      type: String,
      required: [true, "lasttName is required"],
    },
    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email is already registered"],
    },
    password: {
      type: String,
      required: [true, "password is required"],
    },
    age: {
      type: Number,
      required: [true, "age is required"],
    },
    gender: {
      type: String,
      required: [true, "gender is required"],
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
