"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var path = require('path');
var dotenv = require("dotenv");
var App_1 = require("./App");
dotenv.config();
var port = process.env.PORT || 3000;
var mongoDBConnection = process.env.DB_INFO;
console.log("server db connection URL " + mongoDBConnection);
console.log("process.env.DB_INFO " + process.env.DB_INFO);
var server = new App_1.App(mongoDBConnection).expressApp;
var angularDistPath = path.join(__dirname, '../frontend/recipes');
server.use('/', express.static(angularDistPath));
server.get('*', function (req, res) {
    res.sendFile(path.join(angularDistPath, 'index.html'));
});
server.listen(port, function () {
    console.log("server running on port ".concat(port));
});
