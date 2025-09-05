const mongoose = require('mongoose')

const otpSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true
    },
    otp: {
        type: String,
        required: true,
    },
    isVerified:{
        type: Boolean,
        default: false
    },
    expiry: {
        type: Date,
        required: true
    }
}, { timestamps: true })

otpSchema.index({ expiry: 1 }, { expireAfterSeconds: 0 })

module.exports = mongoose.model("Otp", otpSchema)