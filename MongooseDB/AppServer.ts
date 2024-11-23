const express = require('express');
const path = require('path');
import * as dotenv from 'dotenv';
import { App } from './App';

dotenv.config();

const port = process.env.PORT || 3000;
const mongoDBConnection = process.env.DB_INFO;

console.log("server db connection URL " + mongoDBConnection);
console.log("process.env.DB_INFO " + process.env.DB_INFO);

let server: any = new App(mongoDBConnection).expressApp;

const angularDistPath = path.join(__dirname, '../frontend/recipes');
server.use('/', express.static(angularDistPath));

server.get('*', (req, res) => {
    res.sendFile(path.join(angularDistPath, 'index.html'));
});

server.listen(port, () => {
    console.log(`server running on port ${port}`);
});
