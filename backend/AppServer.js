"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require('express');
var path = require('path');
var dotenv = require("dotenv");
var cookieParser = require("cookie-parser");
var expressSession = require("express-session");
var mongoStore = require('connect-mongo');
var App_1 = require("./App");
dotenv.config({ path: path.resolve(__dirname, '../.env') });
console.log("Google Client ID:", process.env.GOOGLE_CLIENT_ID);
console.log("Google Client Secret:", process.env.GOOGLE_CLIENT_SECRET);
var port = process.env.PORT || 8080;
var mongoDBConnection = process.env.DB_INFO;
console.log("server db connection URL " + mongoDBConnection);
console.log("process.env.DB_INFO " + process.env.DB_INFO);
var server = new App_1.App(mongoDBConnection).expressApp;
server.use(cookieParser());
var cors = require('cors');
server.use(cors({
    origin: 'http://localhost:4200', // Replace with your frontend URL
    credentials: true // Allow sending cookies with requests
}));
// Todo : move this?
server.use(expressSession({
    secret: '1234567890QWERTY',
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: mongoStore.create({
        mongoUrl: mongoDBConnection,
        collectionName: 'sessions',
    }),
}));
server.listen(port, function () {
    console.log("server running on port ".concat(port));
});
