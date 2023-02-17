import { Router } from "express";
import userController from "../../controllers/user.controller";
import { validateUser, validateLogin } from "../../middlewares";

const userRouter = Router();

/**
 * @openapi
 * /:
 *   post:
 *     description: Authenticate with email and password
 *     responses:
 *       201:
 *         description: when registration was successful
 *       400:
 *         description: a 400 error is sent when the user provides invalid details.
 */
userRouter.post(
  "/auth/local/register",
  validateUser,
  userController.registerUser
);

userRouter.post("/auth/local/login", validateLogin, userController.login);

userRouter.patch("/auth/verify", userController.verifyUser);

userRouter.delete("", userController.deleteAllUsers);

export default userRouter;
