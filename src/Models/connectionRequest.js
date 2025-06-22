const mongoose = require("mongoose");

const ConnectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    toUserId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    status: {
      type: String,
      enum: {
        values: ["ignore", "intrested", "accepted", "rejected"],
        message: "`${VALUE}` is not status type",
      },
    },
  },
  { timestamps: true }
);

ConnectionRequestSchema.index({ fromUserId: 1, toUserId: 1 });
module.exports = mongoose.model("ConnectionRequest", ConnectionRequestSchema);
