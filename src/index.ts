import Database from './configs/Database';
import 'reflect-metadata';
import * as dotenv from 'dotenv';

dotenv.config();
const port = process.env.PORT || 8000;

Database.instance
  .initialize()
  .then(() => {
    console.log(`Database connected`);
  })
  .catch((error) => {
    console.log(error);

    console.log(`Failed to connect database`, error);
  });

import server from './server';
server.listen(port, () => {
  console.log(`Server is listen on port ${port}`);
});
