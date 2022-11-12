import { Server as HttpServer } from 'http';
import { Socket, Server } from 'socket.io';

export class ServerSocket {
  public static instance: ServerSocket;
  public io: Server;

  public users: { [uid: string]: string };

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    this.users = {};
    this.io = new Server(server, {
      serveClient: false,
      pingInterval: 10000,
      pingTimeout: 5000,
      cookie: false,
      cors: {
        origin: '*',
      },
    });
  }

  StartListeners = (socket: Socket) => {
    console.info('Message received from ' + socket.id);

    socket.on('handshake', () => {
      console.info('Handshake received from: ' + socket.id);
    });

    socket.on('disconnect', () => {
      console.info('Disconnect received from: ' + socket.id);
    });
  };

  start = () => {
    this.io.on('connect', this.StartListeners);
    console.info('Socket IO started.');
  };
}
