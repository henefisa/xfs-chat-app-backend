import { setOnline } from 'src/services/user.service';
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
    socket.on(ESocketEvent.Online, ({ userId }) => {
      setOnline(userId);
    });

    socket.on(ESocketEvent.Subscribe, ({ conversationId, userId }) => {
      socketService.subscribe(conversationId, userId, socket);
    });

    socket.on(ESocketEvent.Disconnect, ({ userId }) => {
      socketService.disconnect(socket, userId);
    });

    socket.on(
      ESocketEvent.SendMessage,
      async ({ userId, conversationId, text }) => {
        socketService.saveMessage(conversationId, userId, text);
        const { user, message } = await socketService.getInfoMessage(
          userId,
          text
        );
        socket
          .to(conversationId)
          .emit(ESocketEvent.GetMessage, { user, message });
      }
    );

    socket.on(ESocketEvent.Unsubscribe, ({ room }) => {
      socketService.unsubscribe(room, socket);
    });
  }
  public start() {
    this.io.on(ESocketEvent.Connection, this.listeners);
    console.info('Socket IO started.');
  }
}
