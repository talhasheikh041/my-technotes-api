"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UserModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        required: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {
        type: [String],
        default: ["Employee"],
    },
    active: {
        type: Boolean,
        default: true,
    },
});
exports.UserModel = mongoose_1.default.model("User", userSchema);
//# sourceMappingURL=User.js.map