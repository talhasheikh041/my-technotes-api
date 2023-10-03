import { verifyJWT } from "../middleware/verifyJWT"
import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from "../controllers/notesController"
import express from "express"

export const noteRouter = express.Router()

// @ts-ignore
noteRouter.use(verifyJWT)

noteRouter
  .route("/")
  .get(getAllNotes)
  .post(createNote)
  .patch(updateNote)
  .delete(deleteNote)
