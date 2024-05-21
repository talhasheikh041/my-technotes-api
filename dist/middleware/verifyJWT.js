"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyJWT = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization;
    if (typeof authHeader !== "string") {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    if (typeof authHeader === "string" && !authHeader.startsWith("Bearer ")) {
        res.status(401).json({ message: "Unauthorized" });
        return;
    }
    const token = authHeader.split(" ")[1];
    jsonwebtoken_1.default.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, decoded) => {
        if (err)
            return res.status(403).json({ message: "Forbidden" });
        const payload = decoded;
        req.user = payload.UserInfo.username;
        req.roles = payload.UserInfo.roles;
        next();
    });
};
exports.verifyJWT = verifyJWT;
//# sourceMappingURL=verifyJWT.js.map