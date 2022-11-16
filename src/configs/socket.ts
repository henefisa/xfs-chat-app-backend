import { ESocketEvent } from 'src/interfaces/socket.interface';
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
    socket.on(ESocketEvent.Subscribe, ({ conversation, member }) => {
      socketService.subscribe(conversation, member, socket);

      socket.on(
        ESocketEvent.SendMessage,
        ({ member, conversation, message }) => {
          socket.to(conversation).emit(ESocketEvent.GetMessage, {
            user: member,
            text: message,
          });

          socketService.saveMessage(conversation, socket, member, message);
        }
      );

      socket.on(ESocketEvent.Disconnect, () => {
        socketService.disconnect(socket, conversation, member);
      });
    });

    socket.on(ESocketEvent.Unsubscribe, (room) => {
      socketService.unsubscribe(room, socket);
    });
  }

  public start() {
    this.io.on(ESocketEvent.Connection, this.listeners);
    console.info('Socket IO started.');
  }
}
