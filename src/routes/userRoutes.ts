import {
  createUser,
  deleteUser,
  getAllUsers,
  updateUser,
} from "../controllers/usersController"
import express from "express"

export const userRouter = express.Router()

userRouter
  .route("/")
  .get(getAllUsers)
  .post(createUser)
  .patch(updateUser)
  .delete(deleteUser)
