import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import payloadValidator from "../services/joi";
import { validateRegex } from "../utils/regex";
import { PASSWORD_REGEX } from "../config/constants";
import { BaseUser } from "../interfaces/user.interface";
import {
  ErrorHandler,
  ValidationError,
  BAD_REQUEST,
  HttpError,
} from "../utils";

const userSchema = Joi.object<BaseUser>({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
  firstName: Joi.string().min(1).required(),
  lastName: Joi.string().min(1).required(),
  role: Joi.string().min(4).max(10).required(),
});

const userLoginSchema = Joi.object({
  email: Joi.string().email().required(),
  password: Joi.string().min(8).required(),
});

const refreshTokenSchema = Joi.object({
  token: Joi.string().required(),
});

const passwordValidator = validateRegex(PASSWORD_REGEX);

const userSchemaValidator = payloadValidator(userSchema);
const userLoginSchemaValidator = payloadValidator(userLoginSchema);
const refreshTokenSchemaValidator = payloadValidator(refreshTokenSchema);

export function validateUser(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // validate user input
    const { error, value } = userSchemaValidator(req.body);
    if (error)
      throw new HttpError(
        BAD_REQUEST,
        error?.message as string,
        ValidationError
      );
    // validate password and check if it's a strong password
    const { password } = value;
    if (!passwordValidator(password)) {
      throw new HttpError(
        BAD_REQUEST,
        "user provided a weak password",
        ValidationError
      );
    }
    next();
  } catch (err) {
    ErrorHandler.handle(err as HttpError, req, res, next);
  }
}

export function validateLogin(
  req: Request,
  res: Response,
  next: NextFunction
): void {
  try {
    // validate user input
    const { error } = userLoginSchemaValidator(req.body);
    if (error) {
      res.status(400).json(error.details);
      return;
    }
    next();
  } catch (err) {
    console.error(err);
    res.status(500).json({});
  }
}
