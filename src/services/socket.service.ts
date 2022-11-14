import { Socket } from 'socket.io';

export const disconnect = (socket: Socket) => {
  console.info('user disconect ' + socket.id);
};

export const subscribe = (room: string, socket: Socket) => {
  try {
    socket.join(room);
    socket.to(room).emit('user joined', socket.id);
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
