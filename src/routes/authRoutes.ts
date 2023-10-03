import {
  loginController,
  logoutController,
  refreshController,
} from "../controllers/authController"
import express from "express"
import { loginLimiter } from "../middleware/loginlimiter"

export const authRouter = express.Router()

authRouter.route("/").post(loginLimiter, loginController)

authRouter.route("/refresh").get(refreshController)

authRouter.route("/logout").post(logoutController)
