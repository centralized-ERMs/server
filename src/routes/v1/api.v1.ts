import { Router } from "express";
import userRouter from "./user.route";

const apiV1 = Router();

/**
 * @openapi
 * /:
 *   get:
 *     description: Welcome to totonga arts api v1
 *     responses:
 *       200:
 *         description: Returns an object with the API status and the NODE_ENV
 */
apiV1.get("/", (req, res) => {
  res.json({
    status: true,
    env: process.env.NODE_ENV,
  });
});

apiV1.use("/user", userRouter);

export default apiV1;
