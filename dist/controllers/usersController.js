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
exports.deleteUser = exports.updateUser = exports.createUser = exports.getAllUsers = void 0;
const User_1 = require("../models/User");
const Note_1 = require("../models/Note");
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const bcrypt_1 = __importDefault(require("bcrypt"));
// @desc Get all users
// @route GET /users
// @access Private
exports.getAllUsers = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield User_1.UserModel.find().select("-password").lean();
    if (!(users === null || users === void 0 ? void 0 : users.length)) {
        res.status(400).json({ message: "No users found!" });
        return;
    }
    res.json(users);
}));
// @desc Create new user
// @route POST /users
// @access Private
exports.createUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { username, password, roles } = req.body;
    if (!username || !password) {
        res.status(400).json({ message: "All input fields are required!" });
        return;
    }
    // find duplicate
    const duplicate = yield User_1.UserModel.findOne({ username })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();
    if (duplicate) {
        res.status(409).json({ message: "Username already present" });
        return;
    }
    // hash password
    const hashedPassword = yield bcrypt_1.default.hash(password, 10); // salt rounds
    // create and store new user
    const userObject = !Array.isArray(roles) || !roles.length
        ? { username, password: hashedPassword }
        : {
            username,
            password: hashedPassword,
            roles,
        };
    const newUser = yield User_1.UserModel.create(userObject);
    if (newUser) {
        res.status(201).json({ message: `New user ${username} created!` });
    }
    else {
        res.status(400).json({ message: "Invalid user data received" });
    }
}));
// @desc Update a user
// @route PATCH /users
// @access Private
exports.updateUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id, username, roles, active, password } = req.body;
    if (!id ||
        !username ||
        !Array.isArray(roles) ||
        !roles.length ||
        typeof active !== "boolean") {
        res.status(400).json({ message: "All fields are required" });
        return;
    }
    const user = yield User_1.UserModel.findById(id).exec();
    if (!user) {
        res.status(400).json({ message: "No User Found!" });
        return;
    }
    // find duplicate
    const duplicate = yield User_1.UserModel.findOne({ username })
        .collation({ locale: "en", strength: 2 })
        .lean()
        .exec();
    // Allow updates to the original user
    if (duplicate && duplicate._id.toString() !== id) {
        res.status(409).json({ message: "Username already present" });
        return;
    }
    user.username = username;
    user.roles = roles;
    user.active = active;
    if (password) {
        user.password = yield bcrypt_1.default.hash(password, 10); // salt rounds
    }
    const updatedUser = yield user.save();
    res.json({ message: `${updatedUser.username} updated` });
}));
// @desc Delete a user
// @route DELETE /users
// @access Private
exports.deleteUser = (0, express_async_handler_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.body;
    if (!id) {
        res.status(400).json({ message: "User ID is required" });
        return;
    }
    const assignedNotes = yield Note_1.NoteModel.find({ user: id }).lean().exec();
    if (assignedNotes.length) {
        res.status(400).json({ message: "Cannot delete user with assigned notes" });
        return;
    }
    const user = yield User_1.UserModel.findById(id).exec();
    if (!user) {
        res.status(400).json({ message: "User not found" });
        return;
    }
    const deletedUser = yield user.deleteOne();
    const reply = `Username ${deletedUser.username} with ID ${deletedUser._id} deleted`;
    res.json(reply);
}));
//# sourceMappingURL=usersController.js.map