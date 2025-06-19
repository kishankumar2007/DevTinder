const mongoose = require('mongoose')
const dbName = 'devTinder'
const connectDB = async() =>{
    try {
    const response = await mongoose.connect(`${process.env.MONGO_URI}/${dbName}`)
     console.log(`Database connected successfully`)
    } catch (error) {
    console.log("Database connection failed",error.message)
    }
}


module.exports= {connectDB}