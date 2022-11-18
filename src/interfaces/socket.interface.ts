export enum ESocketEvent {
  SendMessage = 'SEND_MESSAGE',
  Subscribe = 'SUBSCRIBE',
  GetMessage = 'GET_MESSAGE',
  Disconnect = 'disconnect',
  Unsubscribe = 'UNSUBSCRIBE',
  Connection = 'connection',
  Error = 'ERROR',
  UserLeft = 'USER_LEFT',
  UserJoin = 'USER_JOIN',
}