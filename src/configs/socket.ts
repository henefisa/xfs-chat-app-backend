import { setOnline } from 'src/services/user.service';
import { ESocketEvent } from 'src/interfaces/socket.interface';
import * as socketService from 'src/services/socket.service';
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { config } from 'dotenv';
import { createMessage } from 'src/services/message.service';

config();
let socketIo: Server;

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
      socketService.subscribe(conversationId, userId, socket, socketIo);

      socket.on(ESocketEvent.Disconnect, () => {
        socketService.disconnect(socket, userId);
      });
    });

    socket.on(ESocketEvent.SendMessage, async (data) => {
      try {
        await socketService.validateData(data);
        const { user, message } = await createMessage(
          data.conversationId,
          data.userId,
          data.text,
          data.attachment
        );
        socketIo
          .in(data.conversationId)
          .emit(ESocketEvent.GetMessage, { user, message });
      } catch (error) {
        console.log(error);
        socketIo.emit(ESocketEvent.Error, error);
      }
    });

    socket.on(ESocketEvent.Unsubscribe, ({ room }) => {
      socketService.unsubscribe(room, socket, socketIo);
    });
  }
  public start() {
    socketIo = this.io;
    this.io.on(ESocketEvent.Connection, this.listeners);
    console.info('Socket IO started.');
  }
}
