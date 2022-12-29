/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import { Observable } from "rxjs";
import { BasicResult, ServerRoomChangeRo } from "../common/Core";

export const protobufPackage = "grpc.serving";

/**
 * socket-server provided service
 * room->socket
 */
export interface SocketService {
  /** Server sends room Change event */
  serverRoomChange(request: ServerRoomChangeRo, metadata?: Metadata): Observable<BasicResult>;
}
