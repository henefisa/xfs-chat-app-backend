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

    socket.on(ESocketEvent.Subscribe, ({ conversation, user }) => {
      socketService.subscribe(conversation, user, socket);

      socket.on(ESocketEvent.SendMessage, ({ user, conversation, message }) => {
        socketService.saveMessage(conversation, user, message);
        socket
          .to(conversation)
          .emit(
            ESocketEvent.GetMessage,
            socketService.getInfoMessage(user, message)
          );
      });

      socket.on(ESocketEvent.Disconnect, () => {
        socketService.disconnect(socket, conversation, user);
      });
    });

    socket.on(ESocketEvent.Unsubscribe, ({ room }) => {
      socketService.unsubscribe(room, socket);
    });
  }
  public start() {
    this.io.on(ESocketEvent.Connection, this.listeners);
    console.info('Socket IO started.');
  }
}
