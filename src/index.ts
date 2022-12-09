import * as dotenv from 'dotenv';
import fs from 'fs';
dotenv.config();

import Database from './configs/Database';
import 'reflect-metadata';
import './configs/Peer';
const port = process.env.PORT || 8000;

Database.instance.initialize();

import server from './server';
import { ServerSocket } from './configs/socket';
import http from 'http';
import https from 'https';

if (process.env.NODE_ENV === 'production') {
  const privateKey = fs.readFileSync(
    '/etc/letsencrypt/live/18.142.254.133.sslip.io/privkey.pem',
    'utf8'
  );
  const certificate = fs.readFileSync(
    '/etc/letsencrypt/live/18.142.254.133.sslip.io/cert.pem',
    'utf8'
  );
  const ca = fs.readFileSync(
    '/etc/letsencrypt/live/18.142.254.133.sslip.io/chain.pem',
    'utf8'
  );

  const credentials = {
    key: privateKey,
    cert: certificate,
    ca: ca,
  };

  const httpsServer = https.createServer(credentials, server);
  new ServerSocket(httpsServer).start();

  httpsServer.listen(port, () => {
    console.log(`HTTPS server is listen on port ${port}`);
  });
} else {
  const httpServer = http.createServer(server);
  new ServerSocket(httpServer).start();

  httpServer.listen(port, () => {
    console.log(`HTTP server is listen on port ${port}`);
  });
}
