import bcrypt from "bcrypt"
import { UserModel } from "../models/User"
import jwt from "jsonwebtoken"
import asyncHandler from "express-async-handler"
import type { Request, Response } from "express"

import type { RefreshPayload } from "../middleware/verifyJWT"

// @desc Login
// @route POST /auth
// @access Public
export const loginController = asyncHandler(
  async (req: Request, res: Response) => {
    const { username, password } = req.body

    if (!username || !password) {
      res.status(400).json({ message: "All fields are required" })
      return
    }

    const foundUser = await UserModel.findOne({ username }).lean().exec()

    if (!foundUser) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const matchPassword = await bcrypt.compare(password, foundUser.password)

    if (!matchPassword) {
      res.status(401).json({ message: "Unauthorized" })
      return
    }

    const accessToken = jwt.sign(
      {
        UserInfo: {
          username: foundUser.username,
          roles: foundUser.roles,
        },
      },
      process.env.ACCESS_TOKEN_SECRET as string,
      { expiresIn: "1m" }
    )

    const refreshToken = jwt.sign(
      { username: foundUser.username },
      process.env.REFRESH_TOKEN_SECRET as string,
      { expiresIn: "1d" }
    )

    // Create secure cookie with refresh token
    res.cookie("jwt", refreshToken, {
      httpOnly: true, // accessible only by web server
      secure: true, // https
      sameSite: "none", // cross-site cookie
      maxAge: 7 * 24 * 60 * 60 * 1000, // cookie expiry: set to match refresh token
    })

    res.json({ accessToken })
  }
)

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
export const refreshController = async (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies.jwt) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const refreshToken = cookies.jwt

  jwt.verify(
    refreshToken,
    process.env.ACCESS_TOKEN_SECRET as string,
    (async (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" })
      if (err) {
        res.status(403).json({ message: "Forbidden" })
        return
      }

      const payload = decoded as RefreshPayload

      const foundUser = await UserModel.findOne({
        username: payload.username,
      })
        .lean()
        .exec()

      if (!foundUser) {
        res.status(401).json({ message: "Unauthorized" })
        return
      }

      const accessToken = jwt.sign(
        {
          UserInfo: {
            username: foundUser.username,
            roles: foundUser.roles,
          },
        },
        process.env.ACCESS_TOKEN_SECRET as string,
        { expiresIn: "1m" }
      )

      res.json({ accessToken })
    }) as jwt.VerifyCallback
  )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
export const logoutController = (req: Request, res: Response) => {
  const cookies = req.cookies

  if (!cookies.jwt) {
    res.sendStatus(204) // No content
    return
  }

  res.clearCookie("jwt", { httpOnly: true, sameSite: "none", secure: true })
  res.json({ message: "Cookie cleared" })
}
