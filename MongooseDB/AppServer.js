"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
var App_1 = require("./App");
dotenv.config();
var port = process.env.PORT;
var mongoDBConnection = process.env.DB_INFO;
console.log("server db connection URL " + mongoDBConnection);
console.log("process.env.DB_INFO " + process.env.DB_INFO);
var server = new App_1.App(mongoDBConnection).expressApp;
server.listen(port, function () {
    console.log("server running on port " + port);
});
