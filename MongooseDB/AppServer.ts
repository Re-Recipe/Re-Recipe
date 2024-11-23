const express = require('express');
const path = require('path');
import * as dotenv from 'dotenv';
import * as cookieParser from 'cookie-parser';
import * as expressSession from 'express-session';
const mongoStore = require('connect-mongo'); // Import connect-mongo
import { App } from './App';

dotenv.config();

const port = process.env.PORT || 3000;
const mongoDBConnection = process.env.DB_INFO;

console.log("server db connection URL " + mongoDBConnection);
console.log("process.env.DB_INFO " + process.env.DB_INFO);

// Initialize the Express app instance
let server: any = new App(mongoDBConnection).expressApp;

// Middleware: Cookie parser
server.use(cookieParser());

// Middleware: Express session with MongoDB store
server.use(
  expressSession({
    secret: '1234567890QWERTY', // Replace with a secure secret
    cookie: { maxAge: 60 * 60 * 1000 }, // 1 hour expiration
    resave: false, 
    saveUninitialized: true, 
    store: mongoStore.create({
      mongoUrl: mongoDBConnection, 
      collectionName: 'sessions', 
    }),
  })
);
// Serve Angular frontend files
const angularDistPath = path.join(__dirname, '../frontend/recipes');
server.use('/', express.static(angularDistPath));

// Catch-all route for Angular app
server.get('*', (req, res) => {
  res.sendFile(path.join(angularDistPath, 'index.html'));
});

// Start the server
server.listen(port, () => {
  console.log(`server running on port ${port}`);
});
