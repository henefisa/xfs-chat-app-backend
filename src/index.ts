import express, { Request, Response } from "express";
import dotenv from "dotenv";

dotenv.config();

const server = express();
const port = process.env.PORT || 8000;

server.get("/", (req: Request, res: Response) => {
  res.send("Express + TS server");
});

server.listen(port, () => {
  console.log(`Server is listen on port ${port}`);
});
