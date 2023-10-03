import { rateLimit } from "express-rate-limit"
import { logEvents } from "./logger"
import type { Request, Response, NextFunction } from "express"

export const loginLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5, // Limit each IP to 5 create account requests per `window` (here, per hour)
  message: {
    message:
      "Too many accounts created from this IP, please try again after a 60 seconds pause",
  },
  handler: (req: Request, res: Response, next: NextFunction, options) => {
    logEvents(
      `Too many Requests: ${options.message.message}\t${req.method}]t${req.url}\t${req.headers.origin}`,
      "errLog.log"
    )
    res.status(options.statusCode).send(options.message)
  },
  standardHeaders: true, // Return rate limit info in the `RateLimit-*` headers
  legacyHeaders: false, // Disbale the `X-RateLimit-*` headers
})
