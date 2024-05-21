"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.noteRouter = void 0;
const verifyJWT_1 = require("../middleware/verifyJWT");
const notesController_1 = require("../controllers/notesController");
const express_1 = __importDefault(require("express"));
exports.noteRouter = express_1.default.Router();
// @ts-ignore
exports.noteRouter.use(verifyJWT_1.verifyJWT);
exports.noteRouter
    .route("/")
    .get(notesController_1.getAllNotes)
    .post(notesController_1.createNote)
    .patch(notesController_1.updateNote)
    .delete(notesController_1.deleteNote);
//# sourceMappingURL=noteRoutes.js.map