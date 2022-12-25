import { setOnline } from 'src/services/user.service';
import { ESocketEvent } from 'src/interfaces/socket.interface';
import * as socketService from 'src/services/socket.service';
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { config } from 'dotenv';
import { createMessage } from 'src/services/message.service';

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
    socket.on(ESocketEvent.Online, ({ userId, peerId }) => {
      setOnline(userId, peerId);
    });

    socket.on(ESocketEvent.Subscribe, ({ conversationId, userId }) => {
      socketService.subscribe(conversationId, userId, socket);

      socket.on(ESocketEvent.Disconnect, () => {
        socketService.disconnect(socket, userId);
      });
    });

    socket.on(
      ESocketEvent.SendMessage,
      async ({ userId, conversationId, text, attachment }) => {
        const { user, message } = await createMessage(
          conversationId,
          userId,
          text,
          attachment
        );
        this.io
          .in(conversationId)
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
