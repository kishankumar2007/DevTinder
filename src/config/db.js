const mongoose = require("mongoose");
const dbName = "devTinder";
const connectDB = async () => {
  try {
    await mongoose.connect(`${process.env.MONGO_URI}/${dbName}`);
    console.log(`Database connected successfully`);
    return true
  } catch (error) {
      console.log("Database connection failed :", error.message);
      return false
    }

};

module.exports = { connectDB };
