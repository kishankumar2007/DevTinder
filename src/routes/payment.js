const express = require("express");
const { userAuth } = require("../middleware/auth.Middleware")
const paymentRouter = express.Router()
const memberShip = require("../utils/membership")
const instance = require("../utils/razorpay");
const User = require("../models/user")
const payment = require("../models/paymentSchema");
const crypto = require("crypto");


paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    try {

        const { firstName, lastName, email, _id } = req.user
        const { memberShipType } = req.body
        const order = await instance.orders.create({
            amount: memberShip[memberShipType]["price"] * 100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                name: `${firstName + " " + lastName}`,
                email,
                memberShipType,
                expiry: memberShip[memberShipType]["expiry"]
            }
        })
        const { amount, id, notes, status, currency, expiry } = order
        const response = await payment.create({
            amount: amount / 100,
            email: notes.email,
            memberShipType: notes.memberShipType,
            userId: _id,
            fullName: notes.name,
            orderId: id,
            status,
            currency,
            expiry: notes.expiry
        })
        res.status(200).json({ response, key_id: process.env.RAZORPAY_KEY })
    } catch (error) {
        console.log(error.message)
        return res.json({ message: error.message })
    }
})

paymentRouter.post("/verify-payment", async (req, res) => {
    try {
        const { razorpay_order_id, razorpay_payment_id, razorpay_signature } = req.body
        const body = razorpay_order_id + "|" + razorpay_payment_id
        const generated_signature = crypto.createHmac("sha256", process.env.RAZORPAY_SECRET)
            .update(body.toString())
            .digest("hex")

        const isPaymentValid = razorpay_signature === generated_signature


        if (isPaymentValid) {
            const paymentInfo = await payment.findOneAndUpdate({ orderId: razorpay_order_id }, { status: "paid" }, { new: true })
            const user = await User.findByIdAndUpdate({ _id: paymentInfo.userId }, { membershipType: paymentInfo.memberShipType, isPremium: true, membershipExpiry: paymentInfo.expiry }, { new: true })
            res.status(200).json({ status: 200, message: "Payment success", user, paymentInfo })
        } else {
            const paymentInfo = await payment.findOneAndUpdate({ orderId: razorpay_order_id }, { status: "failed" }, { new: true })
            res.status(200).json({ status: 400, message: "Payment failed", paymentInfo })

        }
    } catch (error) {
        console.log("Payment Verification error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}
);



module.exports = paymentRouter