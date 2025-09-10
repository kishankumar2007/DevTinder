const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middleware/auth.Middleware");
const ConnectionRequest = require("../models/connectionRequest");
const User = require("../models/user");

userRouter.get("/user/request/received", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const connectionRequests = await ConnectionRequest.find({
            toUserId: loggedInUser._id,
            status: "interested",
        }).populate("fromUserId", [
            "firstName",
            "lastName",
            "avatar",
            "about",
            "skills",
            "gender",
            "age",
        ]);

        // if (connectionRequests.length === 0) return res.send([]);
        res.send(connectionRequests);

    } catch (error) {
        res.status(400).json(error.message);
    }
});

const POPULATED_DATA = ["firstName", "lastName", "age", "gender", "skills","avatar","about"]

userRouter.get("/user/connections", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const userConnections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUser._id },
                { toUserId: loggedInUser._id },
            ],
            status: "accepted"
        }).populate("fromUserId", POPULATED_DATA).populate("toUserId", POPULATED_DATA)

        const data = userConnections.map(row => {
            if (loggedInUser._id.toString() === row.fromUserId._id.toString()) return row.toUserId
            return row.fromUserId
        })
        res.json(data)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

userRouter.get("/user/feed", userAuth, async (req, res) => {
    try {
        const loggedInUser = req.user;
        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;

        limit = limit > 50 ? 50 : req.query.limit
        let skip = (page - 1) * limit

        const connectionRequest = await ConnectionRequest.find({
            $or: [{ fromUserId: loggedInUser._id }, { toUserId: loggedInUser._id }],
        }).select("fromUserId  toUserId")

        const hideUserFromFeed = new Set()

        connectionRequest.forEach(request => {
            hideUserFromFeed.add(request.fromUserId.toString())
            hideUserFromFeed.add(request.toUserId.toString())
        })

        const data = await User.find({
            $and: [
                { _id: { $nin: Array.from(hideUserFromFeed) } },
                { _id: { $ne: loggedInUser._id } }
            ]
        }).select(POPULATED_DATA).skip(skip).limit(limit)

        res.status(200).json(data)
    } catch (error) {
        res.status(400).json(error.message)
    }
})

module.exports = userRouter;
