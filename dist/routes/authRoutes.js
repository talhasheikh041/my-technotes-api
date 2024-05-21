"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.authRouter = void 0;
const authController_1 = require("../controllers/authController");
const express_1 = __importDefault(require("express"));
const loginlimiter_1 = require("../middleware/loginlimiter");
exports.authRouter = express_1.default.Router();
exports.authRouter.route("/").post(loginlimiter_1.loginLimiter, authController_1.loginController);
exports.authRouter.route("/refresh").get(authController_1.refreshController);
exports.authRouter.route("/logout").post(authController_1.logoutController);
//# sourceMappingURL=authRoutes.js.map