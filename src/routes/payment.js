const express = require("express");
const { userAuth } = require("../middleware/auth.Middleware")
const paymentRouter = express.Router()
const memberShip = require("../utils/membership")
const instance = require("../utils/razorpay");
const User = require("../models/user")
const payment = require("../models/paymentSchema");
const { validatePaymentVerification } = require("razorpay/dist/utils/razorpay-utils");
const user = require("../models/user");

paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    try {

        const {firstName,lastName,email, _id} = req.user
        const { memberShipType } = req.body
        const order = await instance.orders.create({
            amount: memberShip[memberShipType] * 100,
            currency: "INR",
            receipt: "receipt#1",
            notes: {
                name: `${firstName + " " + lastName}`,
                email,
                memberShipType,
            }
        })
        console.log(order)
        const { amount, id, notes, status, currency } = order
        const response = await payment.create({
            amount,
            email: notes.email,
            memberShipType: notes.memberShipType,
            userId: _id,
            fullName: notes.name,
            orderId: id,
            status,
            currency
        })
        res.status(200).json({ response, key_id: process.env.RAZORPAY_KEY })
    } catch (error) {
        console.log(error.message)
        return res.json({ message: error.message })
    }
})

paymentRouter.post("/payment/webhook", async (req, res) => {
    try {
        const webHookSignature = req.headers('X-Razorpay-Signature')
        const isWebhookValid = validatePaymentVerification(JSON.stringify(req.body), webHookSignature, process.env.WEBHOOK_SECRET)

        if (!isWebhookValid) return res.status(400).json("WebhookSignature is not valid.")
        const paymentDetails = req.body.payload.payment.entity

        if (req.body.event === 'payment.captured') {
            let Payment = await payment.findOne({ orderId: paymentDetails.order_id })
            Payment.status = paymentDetails.status
            await Payment.save()

            let user = await User.findById({ _id: Payment.userId })

            user.isPremium = true
            user.membershipType = Payment.memberShipType

            await user.save()
        }
        if (req.body.event === 'payment.failed') {
            let Payment = await payment.findOne({ orderId: paymentDetails.order_id })
            Payment.status = paymentDetails.status
            await user.save()
        }
        return res.status(200).json({ message: "webhook received successfully." })
    } catch (error) {
        console.log(error.message)
        res.status(400).json({ message: error.message })
    }
})

paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
    const user = req.user.json()
    if (user.isPremium) {
        return res.status(200).json({ isPremium: true })
    } else {
        return res.status(200).json({ isPremium: false })

    }
})

module.exports = paymentRouter