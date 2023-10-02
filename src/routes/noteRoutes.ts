import {
  createNote,
  deleteNote,
  getAllNotes,
  updateNote,
} from "../controllers/notesController"
import express from "express"

export const noteRouter = express.Router()

noteRouter
  .route("/")
  .get(getAllNotes)
  .post(createNote)
  .patch(updateNote)
  .delete(deleteNote)
