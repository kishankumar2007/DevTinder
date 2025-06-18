const express = require('express')
require('dotenv').config()

const app = express()
const PORT = process.env.PORT||3500

app.use('/',(req,res)=>{
    res.send("Welcome to Home Side...")
})

app.listen(PORT,()=>{
    console.log(`Server is listing on ${PORT}`)
})