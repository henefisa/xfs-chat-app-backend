import {
  addIdOnline,
  setIdOffline,
  setOnline,
} from 'src/services/user.service';
import { ESocketEvent } from 'src/interfaces/socket.interface';
import * as socketService from 'src/services/socket.service';
import { Server as HttpServer } from 'http';
import { Server, Socket } from 'socket.io';
import { config } from 'dotenv';
import { createMessage } from 'src/services/message.service';
import redis from './Redis';
import { getRoomToCall } from 'src/utils/redis';
import createConnection from 'src/services/transaction.service';
import { NotFoundException } from 'src/exceptions';
import { ENotificationType } from 'src/interfaces/notification.interface';
import * as userService from 'src/services/user.service';

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
        if (userId !== undefined) {
          await setOnline(userId, socket.id);
          socket.on(ESocketEvent.Disconnect, async () => {
            await socketService.disconnect(socket, userId);
          });
        }
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
          await addIdOnline(id, peerId);
          const allPeerIdOfRoom = await redis.get(id);
          ServerSocket.io
            .in(id)
            .emit(ESocketEvent.GetPeerId, { allPeerIdOfRoom });
        } catch (error) {
          console.log(error);
          ServerSocket.io.emit(ESocketEvent.Error, error);
        }
      }
    );

    socket.on(
      ESocketEvent.LeaveRoomCall,
      async ({ peerId, conversationId }) => {
        try {
          const id = getRoomToCall(conversationId);
          await setIdOffline(id, peerId);
          const allPeerIdOfRoom = await redis.get(id);
          socket.leave(id);
          ServerSocket.io.in(id).emit(ESocketEvent.UserLeft, socket.id);
          ServerSocket.io
            .in(id)
            .emit(ESocketEvent.GetPeerId, { allPeerIdOfRoom });
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

    socket.on(
      ESocketEvent.OfferToCall,
      async ({ ownerId, conversationId, userTargetId }) => {
        try {
          await socketService.OfferToCall(
            ownerId,
            userTargetId,
            conversationId,
            ServerSocket.io
          );
        } catch (error) {
          console.log(error);
          ServerSocket.io.emit(ESocketEvent.Error, error);
        }
      }
    );

    socket.on(ESocketEvent.Typing, async ({ conversationId, userId }) => {
      try {
        const user = await userService.getOneOrThrow({
          where: { id: userId },
        });
        ServerSocket.io
          .in(conversationId)
          .emit(ESocketEvent.Typing, { user, conversationId });
      } catch (error) {
        console.log(error);
        ServerSocket.io.emit(ESocketEvent.Error, error);
      }
    });

    socket.on(ESocketEvent.StopTyping, async ({ conversationId, userId }) => {
      try {
        const user = await userService.getOneOrThrow({
          where: { id: userId },
        });
        ServerSocket.io
          .in(conversationId)
          .emit(ESocketEvent.StopTyping, { user, conversationId });
      } catch (error) {
        console.log(error);
        ServerSocket.io.emit(ESocketEvent.Error, error);
      }
    });

    socket.on(ESocketEvent.SendMessage, async (data) => {
      const queryRunner = await createConnection();
      try {
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
        await queryRunner.rollbackTransaction();
        ServerSocket.io.emit(ESocketEvent.Error, error);
      } finally {
        await queryRunner.release();
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

    socket.on(ENotificationType.FriendRequest, ({ ownerId, userTargetId }) => {
      socketService.handleEmitEventFriendRequest(
        ServerSocket.io,
        ownerId,
        userTargetId
      );
    });
    socket.on(ENotificationType.CancelOrAcceptFriendRequest, ({ userId }) => {
      socketService.handleEmitEventFriendRequest(ServerSocket.io, userId);
    });
  }
  public start() {
    ServerSocket.io.on(ESocketEvent.Connection, this.listeners);
    console.info('Socket IO started.');
  }
}
