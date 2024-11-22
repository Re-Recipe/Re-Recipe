import * as dotenv from 'dotenv';
import { App } from './App';

dotenv.config();

const port = process.env.PORT;
const mongoDBConnection = process.env.DB_INFO;

console.log("server db connection URL " + mongoDBConnection);
console.log("process.env.DB_INFO " + process.env.DB_INFO);

let server: any = new App(mongoDBConnection).expressApp;
server.listen(port, () => {
    console.log("server running on port " + port);
});
