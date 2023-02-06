import { ExpressPeerServer } from 'peer';
import type { CustomExpress, IConfig } from 'peer';
import type { Express } from 'express';
import type { EventEmitter } from 'events';
import type WebSocketLib from 'ws';
import type { Server } from 'net';

declare module 'peer' {
  enum MessageType {
    OPEN = 'OPEN',
    LEAVE = 'LEAVE',
    CANDIDATE = 'CANDIDATE',
    OFFER = 'OFFER',
    ANSWER = 'ANSWER',
    EXPIRE = 'EXPIRE',
    HEARTBEAT = 'HEARTBEAT',
    ID_TAKEN = 'ID-TAKEN',
    ERROR = 'ERROR',
  }

  interface IMessage {
    readonly type: MessageType;
    readonly src: string;
    readonly dst: string;
    readonly payload?: any;
  }

  type MyWebSocket = WebSocketLib & EventEmitter;
  interface IClient {
    getId(): string;
    getToken(): string;
    getSocket(): MyWebSocket | null;
    setSocket(socket: MyWebSocket | null): void;
    getLastPing(): number;
    setLastPing(lastPing: number): void;
    send(data: any): void;
  }

  interface IConfig {
    readonly port?: number;
    readonly expire_timeout?: number;
    readonly alive_timeout?: number;
    readonly key?: string;
    readonly path?: string;
    readonly concurrent_limit?: number;
    readonly allow_discovery?: boolean;
    readonly proxied?: boolean | string;
    readonly cleanup_out_msgs?: number;
    readonly ssl?: {
      key: string;
      cert: string;
    };
    readonly generateClientId?: () => string;
  }

  interface CustomExpress extends Express {
    on(event: string, callback: (...args: any[]) => void): this;
    on(event: 'connection', callback: (client: IClient) => void): this;
    on(event: 'disconnect', callback: (client: IClient) => void): this;
    on(
      event: 'message',
      callback: (client: IClient, message: IMessage) => void
    ): this;
    on(event: 'error', callback: (error: Error) => void): this;
  }
}

class PeerServer {
  public static peerServer: CustomExpress;

  constructor(server: Server, options?: IConfig | undefined) {
    PeerServer.peerServer = ExpressPeerServer(server, options);
  }

  public handleListenEvent() {
    PeerServer.peerServer.on('connection', (client) => {
      console.log('client connected', client);
    });
  }
}

export default PeerServer;
