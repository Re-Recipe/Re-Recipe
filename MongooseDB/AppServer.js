"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var path = require('path');
var dotenv = require("dotenv");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var mongoStore = require('connect-mongo'); // Import connect-mongo
var App_1 = require("./App");
dotenv.config();
var port = process.env.PORT || 3000;
var mongoDBConnection = process.env.DB_INFO;
console.log("server db connection URL " + mongoDBConnection);
console.log("process.env.DB_INFO " + process.env.DB_INFO);
// Initialize the Express app instance
var server = new App_1.App(mongoDBConnection).expressApp;
// Middleware: Cookie parser
server.use(cookieParser());
// Middleware: Express session with MongoDB store
server.use(expressSession({
    secret: '1234567890QWERTY', // Replace with a secure secret
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour expiration
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: mongoDBConnection,
        collectionName: 'sessions',
    }),
}));
// Serve Angular frontend files
var angularDistPath = path.join(__dirname, '../frontend/recipes');
server.use('/', express.static(angularDistPath));
// Catch-all route for Angular app
server.get('*', function (req, res) {
    res.sendFile(path.join(angularDistPath, 'index.html'));
});
// Start the server
server.listen(port, function () {
    console.log("server running on port ".concat(port));
});
