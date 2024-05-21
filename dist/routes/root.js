"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rootRouter = void 0;
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
exports.rootRouter = express_1.default.Router();
exports.rootRouter.get("^/$|/index(.html)?", (req, res) => {
    res.sendFile(path_1.default.join(__dirname, "..", "views", "index.html"));
});
//# sourceMappingURL=root.js.map