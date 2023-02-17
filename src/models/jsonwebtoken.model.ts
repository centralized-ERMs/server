import mongoose from "mongoose";

// Define a Mongoose schema for storing JWT
const sessionModel = mongoose.model(
  "session",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    token: {
      type: String,
      required: true,
    },
    refreshToken: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  })
);

export default sessionModel;
