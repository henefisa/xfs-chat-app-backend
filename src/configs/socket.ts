import { setOnline, setRedisArray } from 'src/services/user.service';
import { ESocketEvent } from 'src/interfaces/socket.interface';
import * as socketService from 'src/services/socket.service';
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { config } from 'dotenv';
import { createMessage } from 'src/services/message.service';
import redis from './Redis';
import { getRoomToCall } from 'src/utils/redis';

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
      try {
        await setOnline(userId, socket.id);
        socket.on(ESocketEvent.Disconnect, async () => {
          await socketService.disconnect(socket, userId);
        });
      } catch (error) {
        console.log(error);
        ServerSocket.io.emit(ESocketEvent.Error, error);
      }
    });

    socket.on(
      ESocketEvent.JoinRoomCall,
      async ({ userId, peerId, conversationId }) => {
        try {
          const id = getRoomToCall(conversationId);
          await socketService.subscribe(id, userId, socket, ServerSocket.io);
          await setRedisArray(id, peerId);
          const allPeerIdOfRoom = await redis.get(id);
          const arrPeerId = allPeerIdOfRoom?.split(',');
          ServerSocket.io.emit(ESocketEvent.GetPeerId, { arrPeerId });
        } catch (error) {
          console.log(error);
          ServerSocket.io.emit(ESocketEvent.Error, error);
        }
      }
    );

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
