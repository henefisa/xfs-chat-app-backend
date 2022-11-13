import * as socketService from 'src/services/socket.service';
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { config } from 'dotenv';

config();

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.io = new Server(server, {
      cors: {
        origin: '*',
      },
    });
  }

  public listeners(socket: Socket) {
    console.info('a user connected.');

    socket.on('disconnect', () => {
      socketService.disconect(socket.id);
    });
  }

  public start() {
    this.io.on('connection', this.listeners);
    console.info('Socket IO started.');
  }
}
