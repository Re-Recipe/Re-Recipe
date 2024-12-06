"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
dotenv.config();
var googleOauth2 = /** @class */ (function () {
    function googleOauth2() {
    }
    googleOauth2.id = process.env.GOOGLE_CLIENT_ID;
    googleOauth2.secret = process.env.GOOGLE_CLIENT_SECRET;
    return googleOauth2;
}());
exports.default = googleOauth2;
