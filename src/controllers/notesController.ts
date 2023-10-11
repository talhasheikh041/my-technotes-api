import { UserModel } from "../models/User"
import { NoteModel } from "../models/Note"
import asyncHandler from "express-async-handler"
import type { Request, Response } from "express"

// @desc Get all users
// @route GET /notes
// @access Private
export const getAllNotes = asyncHandler(async (req: Request, res: Response) => {
  const allNotes = await NoteModel.find().lean().exec()

  if (!allNotes.length) {
    res.status(400).json({ message: "No notes found!" })
    return
  }

  const notesWithUser = await Promise.all(
    allNotes.map(async (note) => {
      const user = await UserModel.findById(note.user).lean().exec()
      return { ...note, username: user?.username }
    })
  )

  res.json(notesWithUser)
})
// @desc Create new note
// @route POST /notes
// @access Private
export const createNote = asyncHandler(async (req: Request, res: Response) => {
  const { user, title, text } = req.body

  if (!user || !title || !text) {
    res.status(400).json({ message: "All fields are required" })
    return
  }

  // check for duplicates
  const duplicate = await NoteModel.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec()
  if (duplicate) {
    res.status(409).json({ message: "Duplicate note title" })
    return
  }

  const newNote = await NoteModel.create({
    user,
    title,
    text,
    ticket: await NoteModel.getTicket(),
  })

  if (newNote) {
    res.status(201).json({ message: `New note "${title}" created!` })
  } else {
    res.status(400).json({ message: "Invalid user data received" })
  }
})

// @desc Upadate a note
// @route PATCH /notes
// @access Private
export const updateNote = asyncHandler(async (req: Request, res: Response) => {
  const { id, user, title, text, completed } = req.body

  // Confirm data
  if (!id || !user || !title || !text || typeof completed !== "boolean") {
    res.status(400).json({ message: "All fields are required" })
    return
  }

  // Confirm note exists to update
  const note = await NoteModel.findById(id).exec()

  if (!note) {
    res.status(400).json({ message: "Note not found" })
    return
  }

  // Check for duplicate title
  const duplicate = await NoteModel.findOne({ title })
    .collation({ locale: "en", strength: 2 })
    .lean()
    .exec()

  // Allow renaming of the original note
  if (duplicate && duplicate?._id.toString() !== id) {
    res.status(409).json({ message: "Duplicate note title" })
    return
  }

  note.user = user
  note.title = title
  note.text = text
  note.completed = completed

  const updatedNote = await note.save()

  res.json({ message: `'${updatedNote.title}' updated` })
})

// @desc Delete a note
// @route DELETE /notes
// @access Private
export const deleteNote = asyncHandler(async (req: Request, res: Response) => {
  const { id } = req.body

  // Confirm data
  if (!id) {
    res.status(400).json({ message: "Note ID required" })
    return
  }

  // Confirm note exists to delete
  const note = await NoteModel.findById(id).exec()

  if (!note) {
    res.status(400).json({ message: "Note not found" })
    return
  }

  const result = await note.deleteOne()

  const reply = `Note '${result.title}' with ID ${result._id} deleted`

  res.json(reply)
})
