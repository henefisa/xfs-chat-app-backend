import { Request, Response } from "express";
const { Pool, Client } = require('pg');


export const pool = new Pool({
    user:'postgres',
    host:'localhost',
    database: 'chatapp',
    password: '01658205896',
    port: 5432,
})