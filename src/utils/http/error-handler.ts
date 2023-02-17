import { Response, NextFunction, Request } from "express";
import * as Errors from "./errors";
import * as HttpCode from "./httpCode";

export class HttpError extends Error {
  status: number;

  constructor(status: number, message: string, name: string) {
    super(message);
    this.status = status;
    this.name = name;
  }
}

export class ErrorHandler {
  static handle(error: Error, req: Request, res: Response, next: NextFunction) {
    console.error(error);
    switch (error.name) {
      case Errors.ValidationError:
        return res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: error.message,
        });
      case Errors.UnauthenticatedError:
        return res.status(HttpCode.UNAUTHORIZED).json({
          success: false,
          message: "Unauthorized",
        });
      case Errors.UnauthenticatedError:
        return res.status(HttpCode.UNAUTHORIZED).json({
          success: false,
          message: "Unauthenticated",
        });
      case Errors.BadRequestError:
        return res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: error.message,
        });
      default:
        return res.status(HttpCode.BAD_REQUEST).json({
          success: false,
          message: "Internal Server Error",
        });
    }
  }
}
