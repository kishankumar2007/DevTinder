const mongoose = require("mongoose")

const paymentSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    fullName: {
        type: String,
    },
    orderId: {
        type: String,
        required: true
    },
    currency: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    email: {
        type: String,
    },
    memberShipType: {
        type: String
    },
    status: {
        type: String,
        required: true
    },
    expiry: {
        type: String,
        required: true
    }
})


module.exports = mongoose.model("payment", paymentSchema)