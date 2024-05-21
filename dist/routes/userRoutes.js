"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userRouter = void 0;
const verifyJWT_1 = require("../middleware/verifyJWT");
const usersController_1 = require("../controllers/usersController");
const express_1 = __importDefault(require("express"));
exports.userRouter = express_1.default.Router();
// @ts-ignore
exports.userRouter.use(verifyJWT_1.verifyJWT);
exports.userRouter
    .route("/")
    .get(usersController_1.getAllUsers)
    .post(usersController_1.createUser)
    .patch(usersController_1.updateUser)
    .delete(usersController_1.deleteUser);
//# sourceMappingURL=userRoutes.js.map