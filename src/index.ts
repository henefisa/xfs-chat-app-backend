import express, { Request, Response } from "express";
import dotenv from "dotenv";
const { Pool, Client } = require('pg');
import  {pool}  from "./configs/DB/index"

dotenv.config();

const server = express();
const port = process.env.PORT;

server.get("/", (req: Request, res: Response) => {
  res.send("Express + TS server");
  
});

// pool.query('SELECT NOW()', (err:Error, res:Response) => {
//   console.log(err, res)
//   pool.end()
// })

server.listen(port, () => {
  console.log(`Server is listen on port ${port}`);
});
