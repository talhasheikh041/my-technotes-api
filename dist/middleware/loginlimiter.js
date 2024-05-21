"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginLimiter = void 0;
const express_rate_limit_1 = require("express-rate-limit");
const logger_1 = require("./logger");
exports.loginLimiter = (0, express_rate_limit_1.rateLimit)({
    windowMs: 60 * 1000,
    max: 5,
    message: {
        message: "Too many accounts created from this IP, please try again after a 60 seconds pause",
    },
    handler: (req, res, next, options) => {
        (0, logger_1.logEvents)(`Too many Requests: ${options.message.message}\t${req.method}]t${req.url}\t${req.headers.origin}`, "errLog.log");
        res.status(options.statusCode).send(options.message);
    },
    standardHeaders: true,
    legacyHeaders: false, // Disbale the `X-RateLimit-*` headers
});
//# sourceMappingURL=loginlimiter.js.map