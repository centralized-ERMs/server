import {
  BAD_REQUEST,
  BadRequestError,
  InternalServerError,
  Role,
} from "../utils";
import MongooseProvider from "../infrastructure/mongoose-provider";
import { HttpError } from "../utils";
import sessionModel from "../models/jsonwebtoken.model";
import { Types } from "mongoose";
import jsonwebtoken from "../services/jsonwebtoken";

// TODO: delete old session. More than 120 days
// Controller for OTP-related actions
class sessionController {
  static sessionProvider: MongooseProvider<{
    userId: Types.ObjectId;
    token: string;
    refreshToken: string;
    createdAt: Date;
  }>;
  private static initClass() {
    sessionController.sessionProvider = new MongooseProvider(sessionModel);
  }

  /**
   * create a new user session
   * @param userId
   * @param role
   * @returns
   */
  static async generateSession(
    userId: string,
    role: Role
  ): Promise<{ token: string; refreshToken: string }> {
    sessionController.initClass();
    //   delete old session
    await this.sessionProvider.findOneAndRemove({ userId });
    const token = await jsonwebtoken.sign(
      { userId, role },
      jsonwebtoken.expiresIn,
      jsonwebtoken.audience
    );
    const refreshToken = await jsonwebtoken.sign(
      { userId, role },
      jsonwebtoken.refreshTokenExpiresIn,
      jsonwebtoken.audience
    );
    if (!token || !refreshToken)
      throw new HttpError(500, "Token creation failed", InternalServerError);
    // save token in the database
    await this.sessionProvider.save({ userId, token, refreshToken });
    return { token, refreshToken };
  }

  /**
   *
   * @param userId
   * @param token
   * @param refreshToken
   * @returns
   */
  static async verifySession(
    userId: string,
    token: string,
    refreshToken: string
  ) {
    const exisitingSession = await this.sessionProvider.findOne({
      token,
      refreshToken,
      userId,
    });

    if (!exisitingSession)
      throw new HttpError(
        BAD_REQUEST,
        "session does not exist",
        BadRequestError
      );
    const session = jsonwebtoken.verify(token);
    if (!session)
      throw new HttpError(BAD_REQUEST, "session has exprired", BadRequestError);

    return session;
  }

  /**
   *
   * @param userId
   * @param token
   * @param refreshToken
   * @param role
   * @returns
   */
  static async refreshToken(
    userId: string,
    token: string,
    refreshToken: string,
    role: Role
  ) {
    const exisitingSession = await this.sessionProvider.findOne({
      token,
      refreshToken,
      userId,
      role,
    });

    if (!exisitingSession)
      throw new HttpError(
        BAD_REQUEST,
        "session does not exist",
        BadRequestError
      );
    return await this.generateSession(userId, role);
  }
}

export default sessionController;
