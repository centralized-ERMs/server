import { NextFunction, Request, Response } from "express";
import userModel from "../models/user.model";
import * as argon2 from "../services/argon";
import MongooseProvider from "../infrastructure/mongoose-provider";
import { UserType } from "../interfaces/user.interface";
import OTPController from "./otp.controller";
import {
  AuthType,
  HttpError,
  BAD_REQUEST,
  CREATED,
  OK,
  ErrorHandler,
  BadRequestError,
  UNAUTHORIZED,
  FORBIDDEN,
  ForbiddenError,
  Role,
} from "../utils";
import EmailService from "../services/nodemailer";
import jsonwebtoken from "../services/jsonwebtoken";
import sessionController from "./session.controller";

// TODO: Delete users each 7 days past the time of creation if user is not activated
// TODO: Refresh Token
// TODO: Reset Password
// TODO: Forgot Password
// TODO: Delete Account

export default class UserController {
  static userProvider: MongooseProvider<UserType>;
  private static initClass() {
    UserController.userProvider = new MongooseProvider(userModel);
  }

  /**
   * check for exisiting user in the system
   * @param authType
   * @param email
   * @returns
   */
  private static async findExisitingUser(
    authType: AuthType,
    email: string
  ): Promise<any> {
    UserController.initClass();
    // Check if the user with the same email already exists
    const existingUser = await UserController.userProvider.findOne({
      email,
      authType,
    });
    return existingUser;
  }

  /**
   * login an existing user into the system with email and password
   * @param req
   * @param res
   * @param next
   */
  static async login(req: Request, res: Response, next: NextFunction) {
    try {
      UserController.initClass();
      // Extract the necessary information from the request body
      const { email, password } = req.body;
      // check for existing users
      const user = (await UserController.findExisitingUser(
        AuthType.EMAIL,
        email
      )) as UserType;

      if (!user)
        throw new HttpError(
          BAD_REQUEST,
          "User with this email does not exists",
          BadRequestError
        );

      // check if user is activated
      if (!(await argon2.verify(user.password as string, password))) {
        throw new HttpError(
          BAD_REQUEST,
          "user provided an invalid password",
          BadRequestError
        );
      }

      if (!user.isVerified)
        return res
          .status(UNAUTHORIZED)
          .json({ message: "User is not verified" });

      // TODO: generate jwt token and refresh token
      const session = await sessionController.generateSession(
        String(user._id),
        user.role as Role
      );
      const { token, refreshToken } = session;
      return res
        .status(OK)
        .json({ message: "User loged in successfully", token, refreshToken });
    } catch (error) {
      ErrorHandler.handle(error as HttpError, req, res, next);
    }
  }

  /**
   * add a new user in the system using email as auth methode
   * @param req
   * @param res
   * @param next
   */
  static async registerUser(req: Request, res: Response, next: NextFunction) {
    try {
      UserController.initClass();
      // Extract the necessary information from the request body
      const { email, password } = req.body;

      // Create a new user instance
      const user = { ...req.body, authType: AuthType.EMAIL };

      // check for existing users
      const existingUser = await UserController.findExisitingUser(
        AuthType.EMAIL,
        email
      );

      if (existingUser) {
        throw new HttpError(
          BAD_REQUEST,
          "User with this email already exists",
          BadRequestError
        );
      }

      // Hash the password using bcrypt
      user.password = await argon2.hash(password);

      // Save the user to the database
      const createdUser = await UserController.userProvider.save(user);

      await OTPController.sendOTP(createdUser);
      // Return the success response
      res.status(CREATED).json({ message: "User registered successfully" });
    } catch (error) {
      // Handle the error
      ErrorHandler.handle(error as HttpError, req, res, next);
    }
  }

  static async verifyUser(req: Request, res: Response, next: NextFunction) {
    try {
      const { otp, email } = req.query;
      const user = await UserController.findExisitingUser(
        AuthType.EMAIL,
        email as string
      );
      if (!user)
        throw new HttpError(
          BAD_REQUEST,
          "User does not exisit",
          BadRequestError
        );
      const isValidOTP = await OTPController.verifyOTP(
        String(user?._id),
        otp as string
      );
      if (!isValidOTP)
        return res.status(BAD_REQUEST).json({ message: "invalid OTP" });

      user.isVerified = true;
      user.save();
      EmailService.sendEmailVerified(user.email);
      return res.status(OK).json({ message: "OTP is verified" });
    } catch (err) {
      // Handle the error
      ErrorHandler.handle(err as HttpError, req, res, next);
    }
  }

  /**
   * Use Google Strategy to log in
   * @param req
   * @param res
   * @param next
   */
  public async authenticateWithGoogle(
    req: Request,
    res: Response,
    next: NextFunction
  ) {}

  /**
   * Use Facebook Strategy to log in
   * @param req
   * @param res
   * @param next
   */
  public async authenticateWithFacebook(
    req: Request,
    res: Response,
    next: NextFunction
  ) {}

  /**
   * Delete all users
   * @param req
   * @param res
   * @param next
   */
  static async deleteAllUsers(req: Request, res: Response, next: NextFunction) {
    try {
      UserController.initClass();
      if (process.env.NODE_ENV !== "local")
        throw new HttpError(
          FORBIDDEN,
          "This action is forbiden",
          ForbiddenError
        );
      await UserController.userProvider.deleteMany({});
      return res.status(OK).json({ message: "Deleted All users" });
    } catch (err) {
      ErrorHandler.handle(err as HttpError, req, res, next);
    }
  }
}
