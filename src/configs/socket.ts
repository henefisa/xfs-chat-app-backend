import { setOnline } from 'src/services/user.service';
import { ESocketEvent } from 'src/interfaces/socket.interface';
import * as socketService from 'src/services/socket.service';
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { config } from 'dotenv';
import { createMessage } from 'src/services/message.service';
import redis from './Redis';
import { getPeerIdKey } from 'src/utils/redis';
import { NotFoundException } from 'src/exceptions';
import createConnection from 'src/services/transaction.service';

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
    socket.on(ESocketEvent.Online, async ({ userId, peerId }) => {
      try {
        await setOnline(userId, peerId);
        socket.on(ESocketEvent.Disconnect, async () => {
          await socketService.disconnect(socket, userId, peerId);
        });
      } catch (error) {
        console.log(error);
        ServerSocket.io.emit(ESocketEvent.Error, error);
      }
    });

    socket.on(ESocketEvent.CallToId, async ({ userId }) => {
      try {
        const peerId = await redis.get(getPeerIdKey(userId));
        ServerSocket.io.emit(ESocketEvent.GetPeerId, { peerId });
      } catch (error) {
        console.log(error);
        ServerSocket.io.emit(ESocketEvent.Error, error);
      }
    });

    socket.on(ESocketEvent.Subscribe, async ({ conversationId, userId }) => {
      try {
        await socketService.subscribe(
          conversationId,
          userId,
          socket,
          ServerSocket.io
        );
      } catch (error) {
        console.log(error);
        ServerSocket.io.emit(ESocketEvent.Error, error);
      }
    });

    socket.on(ESocketEvent.SendMessage, async (data) => {
      try {
        const queryRunner = await createConnection();
        await socketService.validateData(data);
        const inforMessage = await createMessage(
          data.conversationId,
          data.userId,
          data.text,
          data.attachment,
          queryRunner
        );
        if (!inforMessage) {
          throw new NotFoundException('message');
        }
        const user = inforMessage.user;
        const message = inforMessage.message;
        ServerSocket.io
          .in(data.conversationId)
          .emit(ESocketEvent.GetMessage, { user, message });
      } catch (error) {
        console.log(error);
        ServerSocket.io.emit(ESocketEvent.Error, error);
      }
    });

    socket.on(ESocketEvent.Unsubscribe, ({ room }) => {
      try {
        socketService.unsubscribe(room, socket, ServerSocket.io);
      } catch (error) {
        console.log(error);
        ServerSocket.io.emit(ESocketEvent.Error, error);
      }
    });
  }
  public start() {
    ServerSocket.io.on(ESocketEvent.Connection, this.listeners);
    console.info('Socket IO started.');
  }
}
