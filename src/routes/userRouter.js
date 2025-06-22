const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth.Middleware");
const ConnectionRequest = require("../models/connectionRequest");

userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", [
            "firstName",
            "lastName",
            "avtar",
            "about",
            "skills",
            "gender",
            "age",
        ]);

        if (connectionRequests.length === 0) return res.status(404).json({ message: "No Connection request found" });

        res.status(200).json({ message: connectionRequests });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

module.exports = userRouter;
