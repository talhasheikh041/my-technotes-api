import { UserModel } from "../models/User"
import { NoteModel } from "../models/Note"
import asyncHandler from "express-async-handler"
import bcrypt from "bcrypt"

import type { Request, Response } from "express"

// @desc Get all users
// @route GET /users
// @access Private
export const getAllUsers = asyncHandler(async (req: Request, res: Response) => {
  const users = await UserModel.find().select("-password").lean()

  if (!users?.length) {
    res.status(400).json({ message: "No users found!" })
    return
  }

  res.json(users)
})

// @desc Create new user
// @route POST /users
// @access Private
export const createUser = asyncHandler(async (req: Request, res: Response) => {
  const { username, password, roles } = req.body

  if (!username || !password || !Array.isArray(roles) || !roles.length) {
    res.status(400).json({ message: "All input fields are required!" })
    return
  }

  // find duplicate
  const duplicate = await UserModel.findOne({ username }).lean().exec()
  if (duplicate) {
    res.status(409).json({ message: "Username already present" })
    return
  }

  // hash password
  const hashedPassword = await bcrypt.hash(password, 10) // salt rounds

  // create and store new user
  const newUser = await UserModel.create({
    username,
    password: hashedPassword,
    roles,
  })

  if (newUser) {
    res.status(201).json({ message: `New user ${username} created!` })
  } else {
    res.status(400).json({ message: "Invalid user data received" })
  }
})

// @desc Update a user
// @route PATCH /users
// @access Private
export const updateUser = asyncHandler(async (req: Request, res: Response) => {
  const { id, username, roles, active, password } = req.body

  if (
    !id ||
    !username ||
    !Array.isArray(roles) ||
    !roles.length ||
    typeof active !== "boolean"
  ) {
    res.status(400).json({ message: "All fields are required" })
    return
  }

  const user = await UserModel.findById(id).exec()

  if (!user) {
    res.status(400).json({ message: "No User Found!" })
    return
  }

  // find duplicate
  const duplicate = await UserModel.findOne({ username }).lean().exec()
  // Allow updates to the original user
  if (duplicate && duplicate._id.toString() !== id) {
    res.status(409).json({ message: "Username already present" })
    return
  }

  user.username = username
  user.roles = roles
  user.active = active

  if (password) {
    user.password = await bcrypt.hash(password, 10) // salt rounds
  }

  const updatedUser = await user.save()

  res.json({ message: `${updatedUser.username} updated` })
})
// @desc Delete a user
// @route DELETE /users
// @access Private
export const deleteUser = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.body

  if (!id) {
    res.status(400).json({ message: "User ID is required" })
    return
  }

  const assignedNotes = await NoteModel.find({ user: id }).lean().exec()

  if (assignedNotes.length) {
    res.status(400).json({ message: "Cannot delete user with assigned notes" })
    return
  }

  const user = await UserModel.findById(id).exec()

  if (!user) {
    res.status(400).json({ message: "User not found" })
    return
  }

  const deletedUser = await user.deleteOne()

  const reply = `Username ${deletedUser.username} with ID ${deletedUser._id} deleted`

  res.json(reply)
})
