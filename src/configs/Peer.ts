import { PeerServer } from 'peer';

const peerServer = PeerServer({ port: 8001 }, () => {
  console.log('Peer server started');
});

export default peerServer;
