/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { BasicResult } from "../common/Core";

export const protobufPackage = "grpc.serving";

export interface NodeBrowsingRo {
  nodeId: string;
  uuid: string;
}

function createBaseNodeBrowsingRo(): NodeBrowsingRo {
  return { nodeId: "", uuid: "" };
}

export const NodeBrowsingRo = {
  encode(message: NodeBrowsingRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.nodeId !== "") {
      writer.uint32(10).string(message.nodeId);
    }
    if (message.uuid !== "") {
      writer.uint32(18).string(message.uuid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NodeBrowsingRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseNodeBrowsingRo()) as NodeBrowsingRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nodeId = reader.string();
          break;
        case 2:
          message.uuid = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NodeBrowsingRo {
    return {
      nodeId: isSet(object.nodeId) ? String(object.nodeId) : "",
      uuid: isSet(object.uuid) ? String(object.uuid) : "",
    };
  },

  toJSON(message: NodeBrowsingRo): unknown {
    const obj: any = {};
    message.nodeId !== undefined && (obj.nodeId = message.nodeId);
    message.uuid !== undefined && (obj.uuid = message.uuid);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NodeBrowsingRo>, I>>(object: I): NodeBrowsingRo {
    const message = Object.create(createBaseNodeBrowsingRo()) as NodeBrowsingRo;
    message.nodeId = object.nodeId ?? "";
    message.uuid = object.uuid ?? "";
    return message;
  },
};

/**
 * backend-server provided service
 * socket->backend
 */
export interface ApiServingService {
  /** socket->java */
  recordNodeBrowsing(request: NodeBrowsingRo, metadata?: Metadata): Observable<BasicResult>;
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
