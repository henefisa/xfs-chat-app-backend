import { setOffline, getOneOrThrow } from './user.service';
import { ESocketEvent } from 'src/interfaces/socket.interface';
import { Socket } from 'socket.io';
import { createMessage } from './message.service';
import { checkMemberExist } from './participants.service';
import { NotFoundException } from 'src/exceptions';

export const disconnect = (socket: Socket, user: string) => {
  console.info('user disconect ' + socket.id);
  setOffline(user);
};

export const subscribe = async (
  conversation: string,
  user: string,
  socket: Socket
) => {
  try {
    const checked = await checkMemberExist(conversation, user);

    if (!checked) {
      throw new NotFoundException('member');
    }

    socket.join(conversation);
    socket.to(conversation).emit(ESocketEvent.UserJoin, { user });
  } catch (error) {
    socket.emit(ESocketEvent.Error, error);
  }
};

export const unsubscribe = (room: string, socket: Socket) => {
  try {
    socket.leave(room);
    socket.to(room).emit(ESocketEvent.UserLeft, socket.id);
  } catch (error) {
    socket.emit(ESocketEvent.Error, error);
  }
};

export const sendMessage = (
  room: string,
  socket: Socket,
  senderId: string,
  text: string
) => {
  socket.to(room).emit(ESocketEvent.GetMessage, {
    senderId,
    text,
  });
};

export const saveMessage = (
  conversation: string,
  senderId: string,
  text: string
) => {
  createMessage(conversation, senderId, text);
};

export const getInfoMessage = async (userId: string, text: string) => {
  const user = await getOneOrThrow({ where: { id: userId } });
  return {
    user: user,
    message: text,
  };
};
