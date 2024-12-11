"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv = require("dotenv");
const path = require("node:path");
dotenv.config({ path: path.resolve(__dirname, '../.env') });
class googleOauth2 {
}
googleOauth2.id = process.env.GOOGLE_CLIENT_ID;
googleOauth2.secret = process.env.GOOGLE_CLIENT_SECRET;
exports.default = googleOauth2;
//# sourceMappingURL=googleOauth2.js.map