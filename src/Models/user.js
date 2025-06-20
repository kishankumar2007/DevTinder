const mongoose = require("mongoose");

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
