"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("dotenv/config");
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const path_1 = __importDefault(require("path"));
// Routers
const root_1 = require("./routes/root");
const userRoutes_1 = require("./routes/userRoutes");
const noteRoutes_1 = require("./routes/noteRoutes");
const authRoutes_1 = require("./routes/authRoutes");
// Middlewares
const logger_1 = require("./middleware/logger");
const errorHandler_1 = require("./middleware/errorHandler");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const cors_1 = __importDefault(require("cors"));
// configs
const corsOptions_1 = require("./config/corsOptions");
const dbConn_1 = require("./config/dbConn");
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3500;
(0, dbConn_1.connectDB)();
app.use(logger_1.logger);
app.use((0, cors_1.default)(corsOptions_1.corsOptions));
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/", express_1.default.static(path_1.default.join(__dirname, "public")));
app.use("/", root_1.rootRouter);
app.use("/auth", authRoutes_1.authRouter);
app.use("/users", userRoutes_1.userRouter);
app.use("/notes", noteRoutes_1.noteRouter);
app.all("*", (req, res) => {
    res.status(404);
    if (req.accepts("html")) {
        res.sendFile(path_1.default.join(__dirname, "./views/404.html"));
    }
    else if (req.accepts("json")) {
        res.json({ message: "404 not found" });
    }
    else {
        res.type("txt").send("404 not found");
    }
});
app.use(errorHandler_1.errorHandler);
mongoose_1.default.connection.once("open", () => {
    console.log("Connected to mongoDB");
    app.listen(PORT, () => console.log(`Server running on port http://localhost:${PORT}`));
});
mongoose_1.default.connection.on("error", (err) => {
    console.log(err);
    (0, logger_1.logEvents)(`${err.no}: ${err.code}\t${err.syscall}\t${err.hostname}`, "mongoErrLog.log");
});
//# sourceMappingURL=server.js.map