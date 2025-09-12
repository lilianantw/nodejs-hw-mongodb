import {setupServer} from "./server.js";
import { initMongoConnection } from './db/initMongoConnection.js';

const runServer = async () =>{
    await initMongoConnection();
    setupServer();
};
runServer ();

