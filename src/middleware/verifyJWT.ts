import jwt from "jsonwebtoken"
import type { Request, Response, NextFunction } from "express"

export type RefreshPayload = {
  username: string
}

export type AccessPayload = {
  UserInfo: {
    username: string
    roles: string[]
  }
}

interface MyRequestType extends Request {
  user: string
  roles: string[]
}

export const verifyJWT = (
  req: MyRequestType,
  res: Response,
  next: NextFunction
) => {
  const authHeader = req.headers.authorization || req.headers.Authorization

  if (typeof authHeader !== "string") {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  if (typeof authHeader === "string" && !authHeader.startsWith("Bearer ")) {
    res.status(401).json({ message: "Unauthorized" })
    return
  }

  const token = authHeader.split(" ")[1]

  jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET as string,
    (err, decoded) => {
      if (err) return res.status(403).json({ message: "Forbidden" })

      const payload = decoded as AccessPayload
      req.user = payload.UserInfo.username
      req.roles = payload.UserInfo.roles
      next()
    }
  )
}
