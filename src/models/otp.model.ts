import mongoose from "mongoose";

// Define a Mongoose schema for storing OTP
const otpModel = mongoose.model(
  "OTP",
  new mongoose.Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    otp: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: "7d", // OTP is valid for 7 days
    },
  })
);

export default otpModel;
