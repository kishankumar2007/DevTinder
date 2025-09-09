const express = require("express");
const { userAuth } = require("../middleware/auth.Middleware")
const paymentRouter = express.Router()
const memberShip = require("../utils/membership")
const instance = require("../utils/razorpay");
const User = require("../models/user")
const payment = require("../models/paymentSchema");
const { validateWebhookSignature } = require("razorpay/dist/utils/razorpay-utils");


paymentRouter.post("/payment/create", userAuth, async (req, res) => {
    try {

        const { firstName, lastName, email, _id } = req.user
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

paymentRouter.post("/api/webhook", express.raw({ type: "application/json" }), async (req, res) => {
    try {
        console.log("webhook called");

        const webHookSignature = req.get("x-razorpay-signature");

        const isWebhookValid = validateWebhookSignature(
            req.body.toString(),
            webHookSignature,
            process.env.WEBHOOK_SECRET
        );

        if (!isWebhookValid) {
            return res.status(400).send("Webhook signature is not valid.");
        }

        const paymentDetails = JSON.parse(req.body).payload.payment.entity;

        let Payment = await payment.findOne({ orderId: paymentDetails.order_id });
        if (!Payment) return res.status(404).json({ message: "Payment record not found." });

        Payment.status = paymentDetails.status;
        await Payment.save();

        let user = await User.findById(Payment.userId);
        if (!user) return res.status(404).json({ message: "User not found." });

        user.isPremium = true;
        user.membershipType = Payment.memberShipType;
        await user.save();

        return res.status(200).json({ message: "Webhook received successfully." });
    } catch (error) {
        console.log("Webhook error:", error.message);
        return res.status(500).json({ message: error.message });
    }
}
);


paymentRouter.get("/premium/verify", userAuth, async (req, res) => {
    const user = req.user.json()
    if (user.isPremium) {
        return res.status(200).json({ isPremium: true })
    } else {
        return res.status(200).json({ isPremium: false })

    }
})

module.exports = paymentRouter