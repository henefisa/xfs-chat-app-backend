import * as dotenv from 'dotenv';
dotenv.config();

import Database from './configs/Database';
import 'reflect-metadata';
const port = process.env.PORT || 8000;

Database.instance.initialize();

import server from './server';
server.listen(port, () => {
  console.log(`Server is listen on port ${port}`);
});
