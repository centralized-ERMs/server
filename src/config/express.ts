import express from "express";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import sanitize from "express-mongo-sanitize";
import hpp from "hpp";
import cors from "cors";
import api from "../routes/api";

export const initExpress = (app: express.Application) => {
  app.use(helmet());

  const limiter = rateLimit({
    windowMs: 5 * 60 * 60 * 1000, // 5 hours
    max: 10000, // limit each IP to 100 requests per windowMs
  });

  //  apply to all requests
  app.use(limiter);

  app.use(express.json());
  app.use(express.urlencoded({ extended: true }));

  app.use(sanitize());
  app.use(hpp());
  app.use(cors());
  app.use("/api", api);
};
