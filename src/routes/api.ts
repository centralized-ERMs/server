import { Router } from "express";
import { logRequest } from "../middlewares";
import apiV1 from "./v1/api.v1";

const api = Router();

api.use(logRequest);
api.use("/v1", apiV1);

api.get("*", (req, res) => {
  return res.status(400).json({
    status: true,
    message: "invalid route",
    env: process.env.NODE_ENV,
  });
});

api.post("*", (req, res) => {
  return res.status(400).json({
    status: true,
    message: "invalid route",
    env: process.env.NODE_ENV,
  });
});

api.patch("*", (req, res) => {
  return res.status(400).json({
    status: true,
    message: "invalid route",
    env: process.env.NODE_ENV,
  });
});

api.delete("*", (req, res) => {
  return res.status(400).json({
    status: true,
    message: "invalid route",
    env: process.env.NODE_ENV,
  });
});

api.put("*", (req, res) => {
  return res.status(400).json({
    status: true,
    message: "invalid route",
    env: process.env.NODE_ENV,
  });
});

export default api;
