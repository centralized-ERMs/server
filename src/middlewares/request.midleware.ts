import { NextFunction, Request, Response } from "express";
import logger from "../config/logger";

export function logRequest(req: Request, _: Response, next: NextFunction) {
  logger.info(`${req.method} ${req.originalUrl}`);
  next();
}
