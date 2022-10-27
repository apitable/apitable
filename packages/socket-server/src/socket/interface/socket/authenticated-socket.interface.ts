import * as SocketIO from 'socket.io';
import { TokenPayload } from './token-payload.interface';

export interface AuthenticatedSocket extends SocketIO.Socket {
  auth: TokenPayload;
}
