import "dotenv/config"
import express from "express"
import mongoose from "mongoose"
import path from "path"

// Routers
import { rootRouter } from "./routes/root"
import { userRouter } from "./routes/userRoutes"
import { noteRouter } from "./routes/noteRoutes"

// Middlewares
import { logger, logEvents } from "./middleware/logger"
import { errorHandler } from "./middleware/errorHandler"
import cookieParser from "cookie-parser"
import cors from "cors"
import { corsOptions } from "./config/corsOptions"
import { connectDB } from "./config/dbConn"

const app = express()
const PORT = process.env.PORT || 3500

connectDB()

app.use(logger)

app.use(cors(corsOptions))

app.use(express.json())

app.use(cookieParser())

app.use("/", express.static(path.join(__dirname, "public")))

app.use("/", rootRouter)
app.use("/users", userRouter)
app.use("/notes", noteRouter)

app.all("*", (req, res) => {
  res.status(404)
  if (req.accepts("html")) {
    res.sendFile(path.join(__dirname, "./views/404.html"))
  } else if (req.accepts("json")) {
    res.json({ message: "404 not found" })
  } else {
    res.type("txt").send("404 not found")
  }
})

app.use(errorHandler)

mongoose.connection.once("open", () => {
  console.log("Connected to mongoDB")
  app.listen(PORT, () =>
    console.log(`Server running on port http://localhost:${PORT}`)
  )
})

mongoose.connection.on(
  "error",
  (err: { no: number; code: number; syscall: any; hostname: any }) => {
    console.log(err)
    logEvents(
      `${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`,
      "mongoErrLog.log"
    )
  }
)
