import * as dotenv from 'dotenv';
dotenv.config();

import Database from './configs/Database';
import 'reflect-metadata';
const port = process.env.PORT || 8000;

Database.instance.initialize();

import server from './server';
import { ServerSocket } from './configs/socket';
import http from 'http';

const httpServer = http.createServer(server);
new ServerSocket(httpServer).start();

httpServer.listen(port, () => {
  console.log(`Server is listen on port ${port}`);
});
