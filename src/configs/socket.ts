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
  public static io: Server;

  constructor(server: HttpServer) {
    ServerSocket.instance = this;
    ServerSocket.io = new Server(server, {
      cors: {
        origin: '*',
      },
    });
  }

  public listeners(socket: Socket) {
    socket.on(ESocketEvent.Online, async ({ userId }) => {
      await setOnline(userId);
    });

    socket.on(ESocketEvent.Subscribe, ({ conversationId, userId }) => {
      socketService.subscribe(conversationId, userId, socket, ServerSocket.io);

      socket.on(ESocketEvent.Disconnect, async () => {
        await socketService.disconnect(socket, userId);
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
        ServerSocket.io
          .in(data.conversationId)
          .emit(ESocketEvent.GetMessage, { user, message });
      } catch (error) {
        console.log(error);
        ServerSocket.io.emit(ESocketEvent.Error, error);
      }
    });

    socket.on(ESocketEvent.Unsubscribe, ({ room }) => {
      socketService.unsubscribe(room, socket, ServerSocket.io);
    });
  }
  public start() {
    ServerSocket.io.on(ESocketEvent.Connection, this.listeners);
    console.info('Socket IO started.');
  }
}
