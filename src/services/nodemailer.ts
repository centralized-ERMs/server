import nodemailer from "nodemailer";
import logger from "../config/logger";
import { BaseUser, UserType } from "../interfaces/user.interface";
import config from "../shared/config";

class EmailServiceClass {
  transporter: any;
  from: string;
  constructor() {
    this.from = config.email.email;
    this.transporter = nodemailer.createTransport({
      host: "smtp.gmail.com",
      port: 587,
      secure: false,
      auth: {
        user: config.email.email,
        pass: config.email.password,
      },
    });
  }

  private async sendEmail(mailOptions: any) {
    try {
      await this.transporter.sendMail(
        mailOptions,
        (error: Error, info: any) => {
          if (error) {
            logger.error(error.message);
          } else {
            logger.info(`Email sent: ${info.response}`);
          }
        }
      );
    } catch (err) {
      console.error(err);
    }
  }

  // TODO: create an OTP service
  public async sendOTP(user: BaseUser, OTP: string): Promise<void> {
    const mailOptions = {
      from: this.from,
      to: user,
      subject: "Activate your Totonga Account",
      text: `Your OTP is ${OTP}`,
    };
    await this.sendEmail(mailOptions);
  }

  public async sendEmailVerified(user: string): Promise<void> {
    const mailOptions = {
      from: this.from,
      to: user,
      subject: "Activate your Totonga Account",
      text: `Your Email Was verified`,
    };
    await this.sendEmail(mailOptions);
  }
}

const EmailService = new EmailServiceClass();
export default EmailService;
