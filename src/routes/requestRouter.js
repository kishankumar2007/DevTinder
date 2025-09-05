const express = require("express");
const { userAuth } = require("../middleware/auth.Middleware");
const ConnectionRequest = require("../models/connectionRequest");
const { validateConnectionRequest } = require("../utils/validations");
const requestRouter = express.Router();

requestRouter.post(
  "/request/send/:status/:userId",
  userAuth,
  async (req, res) => {
    try {
      const status = req.params?.status;
      const toUserId = req.params?.userId;
      const fromUserId = req.user?._id;

      const isRequestAllowed = await validateConnectionRequest(req);
      if (isRequestAllowed) {
        const userConnectionRequest = new ConnectionRequest({
          fromUserId,
          toUserId,
          status,
        });

        const dbConnectionResponse = await userConnectionRequest.save();
        res.status(200).json({
          message: `${status} successfully`,
          data: dbConnectionResponse,
        });
      }
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const loggedInUser = req.user;
      const status = req.params?.status;
      const requestId = req.params?.requestId;
      const allowedStatusField = ["accepted", "rejected"];

      if (!allowedStatusField.includes(status))
        throw new Error("Invalid status: Expected accepted or rejected");

      const connectionRequest = await ConnectionRequest.findOne({
        fromUserId: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if (!connectionRequest)
        return res
          .status(404)
          .json({ message: "Connection request not found" });

      connectionRequest.status = status;
      const updatedRequest = await connectionRequest.save();

      res.json({ message: "Connected request "+ status,data:updatedRequest});
    } catch (error) {
      res.status(400).json({ message: error.message });
    }

  }
);

module.exports = requestRouter;

