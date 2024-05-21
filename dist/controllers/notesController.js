"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteNote = exports.updateNote = exports.createNote = exports.getAllNotes = void 0;
const User_1 = require("../models/User");
const Note_1 = require("../models/Note");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
// @desc Get all users
// @route GET /notes
// @access Private
exports.getAllNotes = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const allNotes = yield Note_1.NoteModel.find().lean().exec();
    if (!allNotes.length) {
        res.status(400).json({ message: "No notes found!" });
        return;
    }
    const notesWithUser = yield Promise.all(allNotes.map((note) => __awaiter(void 0, void 0, void 0, function* () {
        const user = yield User_1.UserModel.findById(note.user).lean().exec();
        return Object.assign(Object.assign({}, note), { username: user === null || user === void 0 ? void 0 : user.username });
    })));
    res.json(notesWithUser);
}));
// @desc Create new note
// @route POST /notes
// @access Private
exports.createNote = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { user, title, text } = req.body;
    if (!user || !title || !text) {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    // check for duplicates
    const duplicate = yield Note_1.NoteModel.findOne({ title })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();
    if (duplicate) {
        res.status(409).json({ message: "Duplicate note title" });
        return;
    }
    const newNote = yield Note_1.NoteModel.create({
        user,
        title,
        text,
        ticket: yield Note_1.NoteModel.getTicket(),
    });
    if (newNote) {
        res.status(201).json({ message: `New note "${title}" created!` });
    }
    else {
        res.status(400).json({ message: "Invalid user data received" });
    }
}));
// @desc Upadate a note
// @route PATCH /notes
// @access Private
exports.updateNote = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, user, title, text, completed } = req.body;
    // Confirm data
    if (!id || !user || !title || !text || typeof completed !== "boolean") {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    // Confirm note exists to update
    const note = yield Note_1.NoteModel.findById(id).exec();
    if (!note) {
        res.status(400).json({ message: "Note not found" });
        return;
    }
    // Check for duplicate title
    const duplicate = yield Note_1.NoteModel.findOne({ title })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();
    // Allow renaming of the original note
    if (duplicate && (duplicate === null || duplicate === void 0 ? void 0 : duplicate._id.toString()) !== id) {
        res.status(409).json({ message: "Duplicate note title" });
        return;
    }
    note.user = user;
    note.title = title;
    note.text = text;
    note.completed = completed;
    const updatedNote = yield note.save();
    res.json({ message: `'${updatedNote.title}' updated` });
}));
// @desc Delete a note
// @route DELETE /notes
// @access Private
exports.deleteNote = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    // Confirm data
    if (!id) {
        res.status(400).json({ message: "Note ID required" });
        return;
    }
    // Confirm note exists to delete
    const note = yield Note_1.NoteModel.findById(id).exec();
    if (!note) {
        res.status(400).json({ message: "Note not found" });
        return;
    }
    const result = yield note.deleteOne();
    const reply = `Note '${result.title}' with ID ${result._id} deleted`;
    res.json(reply);
}));
//# sourceMappingURL=notesController.js.map