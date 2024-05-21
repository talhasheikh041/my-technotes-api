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
exports.NoteModel = exports.CountModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const countSchema = new mongoose_1.default.Schema({
    seq: {
        type: Number,
    },
});
exports.CountModel = mongoose_1.default.model("Count", countSchema);
const noteSchema = new mongoose_1.default.Schema({
    user: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        required: true,
        ref: "User",
    },
    title: {
        type: String,
        required: true,
    },
    ticket: {
        type: Number,
        required: true,
    },
    text: {
        type: String,
        required: true,
    },
    completed: {
        type: Boolean,
        default: false,
    },
}, {
    timestamps: true,
});
noteSchema.static("getTicket", () => __awaiter(void 0, void 0, void 0, function* () {
    const ret = yield exports.CountModel.findByIdAndUpdate("6514c5f8863f3702b50aa0f7", { $inc: { seq: 1 } }, { new: true, upsert: true });
    return ret.seq;
}));
exports.NoteModel = mongoose_1.default.model("Note", noteSchema);
//# sourceMappingURL=Note.js.map