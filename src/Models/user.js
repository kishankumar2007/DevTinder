const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      required: [true, "firstName is required"],
      minLength: [3, "First name should be greater then 3 letter"],
      maxLength: [25, "First name should be less then 25 letter"],
    },
    lastName: {
      type: String,
      required: [true, "lasttName is required"],
    },

    email: {
      type: String,
      required: [true, "email is required"],
      unique: [true, "email is already registered"],
      minLength:[5,"Email length is too short"],
      maxLength:[30,"Email length is too long"],
      lowerecase: true,
      trim: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: {
      type: String,
      required: [true, "password is required"],
      minLength: [8, "Password must be min length of 8"],
      maxLength: [15, "Password must be between length of 8-15"],
      match: [/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/, "password must includes A Capital letter,number and special charcters "],
    },
    age: {
      type: Number,
      required: [true, "age is required"],
      min: [13, "kid's are not allowed"],
      max: [50, "GrandFather's are not allowed"],
    },
    gender: {
      type: String,
      required: [true, "gender is required"],
      enum: {
        values: ["Male", "Female", "Other"],
        message: "Expected Value should be Either Male,Female Or Other",
      },
    },
    skills: {
      type: [String],
      trim: true,
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

module.exports = User;
