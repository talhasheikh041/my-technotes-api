import express from "express"
import path from "path"

export const rootRouter = express.Router()

rootRouter.get("^/$|/index(.html)?", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "views", "index.html"))
})
