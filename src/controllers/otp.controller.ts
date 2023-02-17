import { BAD_REQUEST, ErrorHandler } from "../utils";
import MongooseProvider from "../infrastructure/mongoose-provider";
import otpModel from "../models/otp.model";
import EmailService from "../services/nodemailer";
import OtpService from "../services/otp.services";
import { BadRequestError, HttpError } from "../utils";

// Controller for OTP-related actions
class OTPController {
  static OTPProvider: MongooseProvider<{
    userId: import("mongoose").Types.ObjectId;
    otp: string;
    createdAt: Date;
  }>;
  private static initClass() {
    OTPController.OTPProvider = new MongooseProvider(otpModel);
  }
  // Generate OTP and send it to the user
  static async generateOTP(userId: String) {
    OTPController.initClass();
    // Generate unique OTP for the user
    let otp = OtpService.generateOtp();

    //   check if OTP does not exisit
    if (await OTPController.OTPProvider.findOne({ otp })) {
      otp = OtpService.generateOtp();
    }

    // Save the OTP in the database
    const otpDoc = await OTPController.OTPProvider.save({
      userId: userId,
      otp,
    });

    // Send the OTP to the user
    return otpDoc;
  }

  static async sendOTP(user: any) {
    const { email, _id } = user;

    // Generate and send OTP
    const otpDoc = await this.generateOTP(_id);
    EmailService.sendOTP(email, String(otpDoc?.otp));
  }

  static async verifyOTP(userId: string, otp: string): Promise<object> {
    OTPController.initClass();
    // Verify the OTP
    const existingOtp = await this.OTPProvider.findOne({ userId, otp });
    if (!existingOtp) {
      throw new HttpError(BAD_REQUEST, "Invalid OTP", BadRequestError);
    }
    // Delete OTP
    await this.OTPProvider.findOneAndRemove({ otp });
    return { message: "OTP verified" };
  }
}

export default OTPController;
