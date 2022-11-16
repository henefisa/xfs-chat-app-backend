import { Socket } from 'socket.io';
import { createMessage } from './message.service';
import { addMember, checkMemberExist } from './participants.service';

export const disconnect = (
  socket: Socket,
  conversation: string,
  member: string
) => {
  console.info('user disconect ' + socket.id);
  socket.to(conversation).emit('message', {
    user: 'Admin',
    text: `${member} just left the room`,
  });
};

export const subscribe = async (
  conversation: string,
  member: string,
  socket: Socket
) => {
  try {
    socket.join(conversation);

    const checked = await checkMemberExist(conversation, member);

    if (!checked) {
      addMember(conversation, member);
    }

    socket.broadcast
      .to(conversation)
      .emit('message', { user: 'Admin', text: `${conversation} has joined!` });
  } catch (error) {
    socket.emit('error', 'couldnt perform requested action');
  }
};

export const unsubscribe = (room: string, socket: Socket) => {
  try {
    socket.leave(room);
    socket.to(room).emit('user left', socket.id);
  } catch (error) {
    socket.emit('error', 'couldnt perform requested action');
  }
};

export const sendMessage = (
  room: string,
  socket: Socket,
  senderId: string,
  text: string
) => {
  socket.to(room).emit('getMessage', {
    senderId,
    text,
  });
};

export const saveMessage = (
  conversation: string,
  socket: Socket,
  senderId: string,
  text: string
) => {
  createMessage(conversation, senderId, text);
};
