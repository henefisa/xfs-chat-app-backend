import { getOne, setOffline } from './user.service';
import { ESocketEvent } from 'src/interfaces/socket.interface';
import { Server, Socket } from 'socket.io';
import { SendMessageDto } from 'src/dto/message';
import { validate } from 'class-validator';
import { HttpException } from 'src/shares/http-exception';
import { StatusCodes } from 'http-status-codes';
import {
  buildError,
  IValidationError,
} from 'src/middlewares/validation.middleware';
import redis from 'src/configs/Redis';
import { getOnlineIdKey } from 'src/utils/redis';

export const disconnect = async (socket: Socket, user: string) => {
  console.info('user disconect ' + socket.id);
  await setOffline(user, socket.id);
};

export const subscribe = async (
  conversation: string,
  user: string,
  socket: Socket,
  io: Server
) => {
  try {
    socket.join(conversation);
    io.in(conversation).emit(ESocketEvent.UserJoin, { user });
  } catch (error) {
    io.emit(ESocketEvent.Error, error);
  }
};

export const unsubscribe = (room: string, socket: Socket, io: Server) => {
  try {
    socket.leave(room);
    io.in(room).emit(ESocketEvent.UserLeft, socket.id);
  } catch (error) {
    io.emit(ESocketEvent.Error, error);
  }
};

export const validateData = async (data: SendMessageDto) => {
  const message = Object.assign(new SendMessageDto(), data);
  const errors = await validate(message, { whitelist: true });
  const result: IValidationError[] = [];
  if (errors.length > 0) {
    throw new HttpException(
      StatusCodes.BAD_REQUEST,
      'Input data validation failed',
      buildError(errors, result)
    );
  }
};

export const handleEmitEventFriendRequest = async (
  ownerId: string,
  userTarget: string,
  io: Server
) => {
  try {
    const user = await getOne({
      where: { id: ownerId },
    });
    const arrString = await redis.get(getOnlineIdKey(userTarget));
    const arraySocketId = JSON.parse(arrString || '[]');
    arraySocketId.forEach((socketId: string) => {
      io.to(socketId).emit(ESocketEvent.GetFriendRequest, { user });
    });
  } catch (error) {
    io.emit(ESocketEvent.Error, error);
  }
};
