import { ESocketEvent } from './../interfaces/socket.interface';
import { Socket } from 'socket.io';
import { createMessage } from './message.service';
import { checkMemberExist } from './participants.service';

export const disconnect = (
  socket: Socket,
  conversation: string,
  user: string
) => {
  console.info('user disconect ' + socket.id);
  socket.to(conversation).emit(ESocketEvent.UserLeft, { user });
};

export const subscribe = async (
  conversation: string,
  user: string,
  socket: Socket
) => {
  try {
    const checked = await checkMemberExist(conversation, user);

    if (!checked) {
      throw new Error();
    }

    socket.join(conversation);

    socket.to(conversation).emit(ESocketEvent.UserJoin, { user });
  } catch (error) {
    socket.emit(ESocketEvent.Error, 'couldnt perform requested action');
  }
};

export const unsubscribe = (room: string, socket: Socket) => {
  try {
    socket.leave(room);
    socket.to(room).emit(ESocketEvent.UserLeft, socket.id);
  } catch (error) {
    socket.emit(ESocketEvent.Error, 'couldnt perform requested action');
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
