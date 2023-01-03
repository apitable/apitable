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
import { BasicResult, ServerRoomChangeRo } from "../common/Core";
import { Any } from "../google/protobuf/any";

export const protobufPackage = "grpc.serving";

export interface WatchRoomRo {
  roomId: string;
  clientId: string;
  cookie: string;
  socketIds: string[];
  shareId?: string | undefined;
  spaceId?: string | undefined;
  embedLinkId?: string | undefined;
}

export interface WatchRoomVo {
  success: boolean;
  code: number;
  message: string;
  data: WatchRoomVo_Data | undefined;
}

export interface WatchRoomVo_ResourceRevision {
  resourceId: string;
  revision: number;
}

export interface WatchRoomVo_ActiveCell {
  fieldId: string;
  recordId: string;
  time: number;
}

export interface WatchRoomVo_Collaborator {
  activeDatasheet: string;
  socketId: string;
  userName?: string | undefined;
  memberName?: string | undefined;
  avatar?: string | undefined;
  userId?: string | undefined;
  shareId?: string | undefined;
  createTime?: number | undefined;
  activeCell?: WatchRoomVo_ActiveCell | undefined;
  nickName?: string | undefined;
  avatarColor?: number | undefined;
}

export interface WatchRoomVo_Data {
  resourceRevisions: WatchRoomVo_ResourceRevision[];
  collaborators: WatchRoomVo_Collaborator[];
  collaborator: WatchRoomVo_Collaborator | undefined;
  spaceId?: string | undefined;
}

export interface GetActiveCollaboratorsVo {
  success: boolean;
  code: number;
  message: string;
  data: GetActiveCollaboratorsVo_Data | undefined;
}

export interface GetActiveCollaboratorsVo_ActiveCell {
  fieldId: string;
  recordId: string;
  time: number;
}

export interface GetActiveCollaboratorsVo_Collaborator {
  activeDatasheet: string;
  socketId: string;
  userName?: string | undefined;
  memberName?: string | undefined;
  avatar?: string | undefined;
  userId?: string | undefined;
  shareId?: string | undefined;
  createTime?: number | undefined;
  activeCell?: GetActiveCollaboratorsVo_ActiveCell | undefined;
  nickName?: string | undefined;
  avatarColor?: number | undefined;
}

export interface GetActiveCollaboratorsVo_Data {
  collaborators: GetActiveCollaboratorsVo_Collaborator[];
}

export interface LeaveRoomRo {
  clientId: string;
}

export interface UserRoomChangeRo {
  cookie: string;
  type: string;
  roomId: string;
  changesets: Any | undefined;
  shareId?: string | undefined;
  clientId: string;
}

export interface UserRoomChangeVo {
  success: boolean;
  code: number;
  message: string;
  data: Any | undefined;
}

export interface NodeCopyRo {
  /** 原始数表ID */
  nodeId: string;
  /** 复制的数表ID */
  copyNodeId: string;
  /** 用户ID */
  userId: string;
  /** 用户uuid */
  uuid: string;
  /** 需要转换的fieldId数组 */
  fieldIds: string[];
}

export interface NodeDeleteRo {
  /** 删除节点的数组 */
  deleteNodeId: string[];
  /** 需要转换字段的关联表 */
  linkNodeId: string[];
  /** 用户ID */
  userId: string;
  /** 用户uuid */
  uuid: string;
}

function createBaseWatchRoomRo(): WatchRoomRo {
  return {
    roomId: "",
    clientId: "",
    cookie: "",
    socketIds: [],
    shareId: undefined,
    spaceId: undefined,
    embedLinkId: undefined,
  };
}

export const WatchRoomRo = {
  encode(message: WatchRoomRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.roomId !== "") {
      writer.uint32(10).string(message.roomId);
    }
    if (message.clientId !== "") {
      writer.uint32(18).string(message.clientId);
    }
    if (message.cookie !== "") {
      writer.uint32(26).string(message.cookie);
    }
    for (const v of message.socketIds) {
      writer.uint32(34).string(v!);
    }
    if (message.shareId !== undefined) {
      writer.uint32(42).string(message.shareId);
    }
    if (message.spaceId !== undefined) {
      writer.uint32(50).string(message.spaceId);
    }
    if (message.embedLinkId !== undefined) {
      writer.uint32(58).string(message.embedLinkId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WatchRoomRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseWatchRoomRo()) as WatchRoomRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.roomId = reader.string();
          break;
        case 2:
          message.clientId = reader.string();
          break;
        case 3:
          message.cookie = reader.string();
          break;
        case 4:
          message.socketIds.push(reader.string());
          break;
        case 5:
          message.shareId = reader.string();
          break;
        case 6:
          message.spaceId = reader.string();
          break;
        case 7:
          message.embedLinkId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WatchRoomRo {
    return {
      roomId: isSet(object.roomId) ? String(object.roomId) : "",
      clientId: isSet(object.clientId) ? String(object.clientId) : "",
      cookie: isSet(object.cookie) ? String(object.cookie) : "",
      socketIds: Array.isArray(object?.socketIds) ? object.socketIds.map((e: any) => String(e)) : [],
      shareId: isSet(object.shareId) ? String(object.shareId) : undefined,
      spaceId: isSet(object.spaceId) ? String(object.spaceId) : undefined,
      embedLinkId: isSet(object.embedLinkId) ? String(object.embedLinkId) : undefined,
    };
  },

  toJSON(message: WatchRoomRo): unknown {
    const obj: any = {};
    message.roomId !== undefined && (obj.roomId = message.roomId);
    message.clientId !== undefined && (obj.clientId = message.clientId);
    message.cookie !== undefined && (obj.cookie = message.cookie);
    if (message.socketIds) {
      obj.socketIds = message.socketIds.map((e) => e);
    } else {
      obj.socketIds = [];
    }
    message.shareId !== undefined && (obj.shareId = message.shareId);
    message.spaceId !== undefined && (obj.spaceId = message.spaceId);
    message.embedLinkId !== undefined && (obj.embedLinkId = message.embedLinkId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<WatchRoomRo>, I>>(object: I): WatchRoomRo {
    const message = Object.create(createBaseWatchRoomRo()) as WatchRoomRo;
    message.roomId = object.roomId ?? "";
    message.clientId = object.clientId ?? "";
    message.cookie = object.cookie ?? "";
    message.socketIds = object.socketIds?.map((e) => e) || [];
    message.shareId = object.shareId ?? undefined;
    message.spaceId = object.spaceId ?? undefined;
    message.embedLinkId = object.embedLinkId ?? undefined;
    return message;
  },
};

function createBaseWatchRoomVo(): WatchRoomVo {
  return { success: false, code: 0, message: "", data: undefined };
}

export const WatchRoomVo = {
  encode(message: WatchRoomVo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    if (message.code !== 0) {
      writer.uint32(16).int32(message.code);
    }
    if (message.message !== "") {
      writer.uint32(26).string(message.message);
    }
    if (message.data !== undefined) {
      WatchRoomVo_Data.encode(message.data, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WatchRoomVo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseWatchRoomVo()) as WatchRoomVo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        case 2:
          message.code = reader.int32();
          break;
        case 3:
          message.message = reader.string();
          break;
        case 4:
          message.data = WatchRoomVo_Data.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WatchRoomVo {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      code: isSet(object.code) ? Number(object.code) : 0,
      message: isSet(object.message) ? String(object.message) : "",
      data: isSet(object.data) ? WatchRoomVo_Data.fromJSON(object.data) : undefined,
    };
  },

  toJSON(message: WatchRoomVo): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    message.code !== undefined && (obj.code = Math.round(message.code));
    message.message !== undefined && (obj.message = message.message);
    message.data !== undefined && (obj.data = message.data ? WatchRoomVo_Data.toJSON(message.data) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<WatchRoomVo>, I>>(object: I): WatchRoomVo {
    const message = Object.create(createBaseWatchRoomVo()) as WatchRoomVo;
    message.success = object.success ?? false;
    message.code = object.code ?? 0;
    message.message = object.message ?? "";
    message.data = (object.data !== undefined && object.data !== null)
      ? WatchRoomVo_Data.fromPartial(object.data)
      : undefined;
    return message;
  },
};

function createBaseWatchRoomVo_ResourceRevision(): WatchRoomVo_ResourceRevision {
  return { resourceId: "", revision: 0 };
}

export const WatchRoomVo_ResourceRevision = {
  encode(message: WatchRoomVo_ResourceRevision, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.resourceId !== "") {
      writer.uint32(10).string(message.resourceId);
    }
    if (message.revision !== 0) {
      writer.uint32(16).int32(message.revision);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WatchRoomVo_ResourceRevision {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseWatchRoomVo_ResourceRevision()) as WatchRoomVo_ResourceRevision;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.resourceId = reader.string();
          break;
        case 2:
          message.revision = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WatchRoomVo_ResourceRevision {
    return {
      resourceId: isSet(object.resourceId) ? String(object.resourceId) : "",
      revision: isSet(object.revision) ? Number(object.revision) : 0,
    };
  },

  toJSON(message: WatchRoomVo_ResourceRevision): unknown {
    const obj: any = {};
    message.resourceId !== undefined && (obj.resourceId = message.resourceId);
    message.revision !== undefined && (obj.revision = Math.round(message.revision));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<WatchRoomVo_ResourceRevision>, I>>(object: I): WatchRoomVo_ResourceRevision {
    const message = Object.create(createBaseWatchRoomVo_ResourceRevision()) as WatchRoomVo_ResourceRevision;
    message.resourceId = object.resourceId ?? "";
    message.revision = object.revision ?? 0;
    return message;
  },
};

function createBaseWatchRoomVo_ActiveCell(): WatchRoomVo_ActiveCell {
  return { fieldId: "", recordId: "", time: 0 };
}

export const WatchRoomVo_ActiveCell = {
  encode(message: WatchRoomVo_ActiveCell, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fieldId !== "") {
      writer.uint32(10).string(message.fieldId);
    }
    if (message.recordId !== "") {
      writer.uint32(18).string(message.recordId);
    }
    if (message.time !== 0) {
      writer.uint32(24).uint32(message.time);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WatchRoomVo_ActiveCell {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseWatchRoomVo_ActiveCell()) as WatchRoomVo_ActiveCell;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.fieldId = reader.string();
          break;
        case 2:
          message.recordId = reader.string();
          break;
        case 3:
          message.time = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WatchRoomVo_ActiveCell {
    return {
      fieldId: isSet(object.fieldId) ? String(object.fieldId) : "",
      recordId: isSet(object.recordId) ? String(object.recordId) : "",
      time: isSet(object.time) ? Number(object.time) : 0,
    };
  },

  toJSON(message: WatchRoomVo_ActiveCell): unknown {
    const obj: any = {};
    message.fieldId !== undefined && (obj.fieldId = message.fieldId);
    message.recordId !== undefined && (obj.recordId = message.recordId);
    message.time !== undefined && (obj.time = Math.round(message.time));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<WatchRoomVo_ActiveCell>, I>>(object: I): WatchRoomVo_ActiveCell {
    const message = Object.create(createBaseWatchRoomVo_ActiveCell()) as WatchRoomVo_ActiveCell;
    message.fieldId = object.fieldId ?? "";
    message.recordId = object.recordId ?? "";
    message.time = object.time ?? 0;
    return message;
  },
};

function createBaseWatchRoomVo_Collaborator(): WatchRoomVo_Collaborator {
  return {
    activeDatasheet: "",
    socketId: "",
    userName: undefined,
    memberName: undefined,
    avatar: undefined,
    userId: undefined,
    shareId: undefined,
    createTime: undefined,
    activeCell: undefined,
    nickName: undefined,
    avatarColor: undefined,
  };
}

export const WatchRoomVo_Collaborator = {
  encode(message: WatchRoomVo_Collaborator, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.activeDatasheet !== "") {
      writer.uint32(10).string(message.activeDatasheet);
    }
    if (message.socketId !== "") {
      writer.uint32(18).string(message.socketId);
    }
    if (message.userName !== undefined) {
      writer.uint32(26).string(message.userName);
    }
    if (message.memberName !== undefined) {
      writer.uint32(34).string(message.memberName);
    }
    if (message.avatar !== undefined) {
      writer.uint32(42).string(message.avatar);
    }
    if (message.userId !== undefined) {
      writer.uint32(50).string(message.userId);
    }
    if (message.shareId !== undefined) {
      writer.uint32(58).string(message.shareId);
    }
    if (message.createTime !== undefined) {
      writer.uint32(64).uint32(message.createTime);
    }
    if (message.activeCell !== undefined) {
      WatchRoomVo_ActiveCell.encode(message.activeCell, writer.uint32(74).fork()).ldelim();
    }
    if (message.nickName !== undefined) {
      writer.uint32(82).string(message.nickName);
    }
    if (message.avatarColor !== undefined) {
      writer.uint32(88).int32(message.avatarColor);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WatchRoomVo_Collaborator {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseWatchRoomVo_Collaborator()) as WatchRoomVo_Collaborator;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.activeDatasheet = reader.string();
          break;
        case 2:
          message.socketId = reader.string();
          break;
        case 3:
          message.userName = reader.string();
          break;
        case 4:
          message.memberName = reader.string();
          break;
        case 5:
          message.avatar = reader.string();
          break;
        case 6:
          message.userId = reader.string();
          break;
        case 7:
          message.shareId = reader.string();
          break;
        case 8:
          message.createTime = reader.uint32();
          break;
        case 9:
          message.activeCell = WatchRoomVo_ActiveCell.decode(reader, reader.uint32());
          break;
        case 10:
          message.nickName = reader.string();
          break;
        case 11:
          message.avatarColor = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WatchRoomVo_Collaborator {
    return {
      activeDatasheet: isSet(object.activeDatasheet) ? String(object.activeDatasheet) : "",
      socketId: isSet(object.socketId) ? String(object.socketId) : "",
      userName: isSet(object.userName) ? String(object.userName) : undefined,
      memberName: isSet(object.memberName) ? String(object.memberName) : undefined,
      avatar: isSet(object.avatar) ? String(object.avatar) : undefined,
      userId: isSet(object.userId) ? String(object.userId) : undefined,
      shareId: isSet(object.shareId) ? String(object.shareId) : undefined,
      createTime: isSet(object.createTime) ? Number(object.createTime) : undefined,
      activeCell: isSet(object.activeCell) ? WatchRoomVo_ActiveCell.fromJSON(object.activeCell) : undefined,
      nickName: isSet(object.nickName) ? String(object.nickName) : undefined,
      avatarColor: isSet(object.avatarColor) ? Number(object.avatarColor) : undefined,
    };
  },

  toJSON(message: WatchRoomVo_Collaborator): unknown {
    const obj: any = {};
    message.activeDatasheet !== undefined && (obj.activeDatasheet = message.activeDatasheet);
    message.socketId !== undefined && (obj.socketId = message.socketId);
    message.userName !== undefined && (obj.userName = message.userName);
    message.memberName !== undefined && (obj.memberName = message.memberName);
    message.avatar !== undefined && (obj.avatar = message.avatar);
    message.userId !== undefined && (obj.userId = message.userId);
    message.shareId !== undefined && (obj.shareId = message.shareId);
    message.createTime !== undefined && (obj.createTime = Math.round(message.createTime));
    message.activeCell !== undefined &&
      (obj.activeCell = message.activeCell ? WatchRoomVo_ActiveCell.toJSON(message.activeCell) : undefined);
    message.nickName !== undefined && (obj.nickName = message.nickName);
    message.avatarColor !== undefined && (obj.avatarColor = Math.round(message.avatarColor));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<WatchRoomVo_Collaborator>, I>>(object: I): WatchRoomVo_Collaborator {
    const message = Object.create(createBaseWatchRoomVo_Collaborator()) as WatchRoomVo_Collaborator;
    message.activeDatasheet = object.activeDatasheet ?? "";
    message.socketId = object.socketId ?? "";
    message.userName = object.userName ?? undefined;
    message.memberName = object.memberName ?? undefined;
    message.avatar = object.avatar ?? undefined;
    message.userId = object.userId ?? undefined;
    message.shareId = object.shareId ?? undefined;
    message.createTime = object.createTime ?? undefined;
    message.activeCell = (object.activeCell !== undefined && object.activeCell !== null)
      ? WatchRoomVo_ActiveCell.fromPartial(object.activeCell)
      : undefined;
    message.nickName = object.nickName ?? undefined;
    message.avatarColor = object.avatarColor ?? undefined;
    return message;
  },
};

function createBaseWatchRoomVo_Data(): WatchRoomVo_Data {
  return { resourceRevisions: [], collaborators: [], collaborator: undefined, spaceId: undefined };
}

export const WatchRoomVo_Data = {
  encode(message: WatchRoomVo_Data, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.resourceRevisions) {
      WatchRoomVo_ResourceRevision.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    for (const v of message.collaborators) {
      WatchRoomVo_Collaborator.encode(v!, writer.uint32(18).fork()).ldelim();
    }
    if (message.collaborator !== undefined) {
      WatchRoomVo_Collaborator.encode(message.collaborator, writer.uint32(26).fork()).ldelim();
    }
    if (message.spaceId !== undefined) {
      writer.uint32(34).string(message.spaceId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): WatchRoomVo_Data {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseWatchRoomVo_Data()) as WatchRoomVo_Data;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.resourceRevisions.push(WatchRoomVo_ResourceRevision.decode(reader, reader.uint32()));
          break;
        case 2:
          message.collaborators.push(WatchRoomVo_Collaborator.decode(reader, reader.uint32()));
          break;
        case 3:
          message.collaborator = WatchRoomVo_Collaborator.decode(reader, reader.uint32());
          break;
        case 4:
          message.spaceId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): WatchRoomVo_Data {
    return {
      resourceRevisions: Array.isArray(object?.resourceRevisions)
        ? object.resourceRevisions.map((e: any) => WatchRoomVo_ResourceRevision.fromJSON(e))
        : [],
      collaborators: Array.isArray(object?.collaborators)
        ? object.collaborators.map((e: any) => WatchRoomVo_Collaborator.fromJSON(e))
        : [],
      collaborator: isSet(object.collaborator) ? WatchRoomVo_Collaborator.fromJSON(object.collaborator) : undefined,
      spaceId: isSet(object.spaceId) ? String(object.spaceId) : undefined,
    };
  },

  toJSON(message: WatchRoomVo_Data): unknown {
    const obj: any = {};
    if (message.resourceRevisions) {
      obj.resourceRevisions = message.resourceRevisions.map((e) =>
        e ? WatchRoomVo_ResourceRevision.toJSON(e) : undefined
      );
    } else {
      obj.resourceRevisions = [];
    }
    if (message.collaborators) {
      obj.collaborators = message.collaborators.map((e) => e ? WatchRoomVo_Collaborator.toJSON(e) : undefined);
    } else {
      obj.collaborators = [];
    }
    message.collaborator !== undefined &&
      (obj.collaborator = message.collaborator ? WatchRoomVo_Collaborator.toJSON(message.collaborator) : undefined);
    message.spaceId !== undefined && (obj.spaceId = message.spaceId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<WatchRoomVo_Data>, I>>(object: I): WatchRoomVo_Data {
    const message = Object.create(createBaseWatchRoomVo_Data()) as WatchRoomVo_Data;
    message.resourceRevisions = object.resourceRevisions?.map((e) => WatchRoomVo_ResourceRevision.fromPartial(e)) || [];
    message.collaborators = object.collaborators?.map((e) => WatchRoomVo_Collaborator.fromPartial(e)) || [];
    message.collaborator = (object.collaborator !== undefined && object.collaborator !== null)
      ? WatchRoomVo_Collaborator.fromPartial(object.collaborator)
      : undefined;
    message.spaceId = object.spaceId ?? undefined;
    return message;
  },
};

function createBaseGetActiveCollaboratorsVo(): GetActiveCollaboratorsVo {
  return { success: false, code: 0, message: "", data: undefined };
}

export const GetActiveCollaboratorsVo = {
  encode(message: GetActiveCollaboratorsVo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    if (message.code !== 0) {
      writer.uint32(16).int32(message.code);
    }
    if (message.message !== "") {
      writer.uint32(26).string(message.message);
    }
    if (message.data !== undefined) {
      GetActiveCollaboratorsVo_Data.encode(message.data, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetActiveCollaboratorsVo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseGetActiveCollaboratorsVo()) as GetActiveCollaboratorsVo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        case 2:
          message.code = reader.int32();
          break;
        case 3:
          message.message = reader.string();
          break;
        case 4:
          message.data = GetActiveCollaboratorsVo_Data.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetActiveCollaboratorsVo {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      code: isSet(object.code) ? Number(object.code) : 0,
      message: isSet(object.message) ? String(object.message) : "",
      data: isSet(object.data) ? GetActiveCollaboratorsVo_Data.fromJSON(object.data) : undefined,
    };
  },

  toJSON(message: GetActiveCollaboratorsVo): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    message.code !== undefined && (obj.code = Math.round(message.code));
    message.message !== undefined && (obj.message = message.message);
    message.data !== undefined &&
      (obj.data = message.data ? GetActiveCollaboratorsVo_Data.toJSON(message.data) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetActiveCollaboratorsVo>, I>>(object: I): GetActiveCollaboratorsVo {
    const message = Object.create(createBaseGetActiveCollaboratorsVo()) as GetActiveCollaboratorsVo;
    message.success = object.success ?? false;
    message.code = object.code ?? 0;
    message.message = object.message ?? "";
    message.data = (object.data !== undefined && object.data !== null)
      ? GetActiveCollaboratorsVo_Data.fromPartial(object.data)
      : undefined;
    return message;
  },
};

function createBaseGetActiveCollaboratorsVo_ActiveCell(): GetActiveCollaboratorsVo_ActiveCell {
  return { fieldId: "", recordId: "", time: 0 };
}

export const GetActiveCollaboratorsVo_ActiveCell = {
  encode(message: GetActiveCollaboratorsVo_ActiveCell, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.fieldId !== "") {
      writer.uint32(10).string(message.fieldId);
    }
    if (message.recordId !== "") {
      writer.uint32(18).string(message.recordId);
    }
    if (message.time !== 0) {
      writer.uint32(24).uint32(message.time);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetActiveCollaboratorsVo_ActiveCell {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(
      createBaseGetActiveCollaboratorsVo_ActiveCell(),
    ) as GetActiveCollaboratorsVo_ActiveCell;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.fieldId = reader.string();
          break;
        case 2:
          message.recordId = reader.string();
          break;
        case 3:
          message.time = reader.uint32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetActiveCollaboratorsVo_ActiveCell {
    return {
      fieldId: isSet(object.fieldId) ? String(object.fieldId) : "",
      recordId: isSet(object.recordId) ? String(object.recordId) : "",
      time: isSet(object.time) ? Number(object.time) : 0,
    };
  },

  toJSON(message: GetActiveCollaboratorsVo_ActiveCell): unknown {
    const obj: any = {};
    message.fieldId !== undefined && (obj.fieldId = message.fieldId);
    message.recordId !== undefined && (obj.recordId = message.recordId);
    message.time !== undefined && (obj.time = Math.round(message.time));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetActiveCollaboratorsVo_ActiveCell>, I>>(
    object: I,
  ): GetActiveCollaboratorsVo_ActiveCell {
    const message = Object.create(
      createBaseGetActiveCollaboratorsVo_ActiveCell(),
    ) as GetActiveCollaboratorsVo_ActiveCell;
    message.fieldId = object.fieldId ?? "";
    message.recordId = object.recordId ?? "";
    message.time = object.time ?? 0;
    return message;
  },
};

function createBaseGetActiveCollaboratorsVo_Collaborator(): GetActiveCollaboratorsVo_Collaborator {
  return {
    activeDatasheet: "",
    socketId: "",
    userName: undefined,
    memberName: undefined,
    avatar: undefined,
    userId: undefined,
    shareId: undefined,
    createTime: undefined,
    activeCell: undefined,
    nickName: undefined,
    avatarColor: undefined,
  };
}

export const GetActiveCollaboratorsVo_Collaborator = {
  encode(message: GetActiveCollaboratorsVo_Collaborator, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.activeDatasheet !== "") {
      writer.uint32(10).string(message.activeDatasheet);
    }
    if (message.socketId !== "") {
      writer.uint32(18).string(message.socketId);
    }
    if (message.userName !== undefined) {
      writer.uint32(26).string(message.userName);
    }
    if (message.memberName !== undefined) {
      writer.uint32(34).string(message.memberName);
    }
    if (message.avatar !== undefined) {
      writer.uint32(42).string(message.avatar);
    }
    if (message.userId !== undefined) {
      writer.uint32(50).string(message.userId);
    }
    if (message.shareId !== undefined) {
      writer.uint32(58).string(message.shareId);
    }
    if (message.createTime !== undefined) {
      writer.uint32(64).uint32(message.createTime);
    }
    if (message.activeCell !== undefined) {
      GetActiveCollaboratorsVo_ActiveCell.encode(message.activeCell, writer.uint32(74).fork()).ldelim();
    }
    if (message.nickName !== undefined) {
      writer.uint32(82).string(message.nickName);
    }
    if (message.avatarColor !== undefined) {
      writer.uint32(88).int32(message.avatarColor);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetActiveCollaboratorsVo_Collaborator {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(
      createBaseGetActiveCollaboratorsVo_Collaborator(),
    ) as GetActiveCollaboratorsVo_Collaborator;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.activeDatasheet = reader.string();
          break;
        case 2:
          message.socketId = reader.string();
          break;
        case 3:
          message.userName = reader.string();
          break;
        case 4:
          message.memberName = reader.string();
          break;
        case 5:
          message.avatar = reader.string();
          break;
        case 6:
          message.userId = reader.string();
          break;
        case 7:
          message.shareId = reader.string();
          break;
        case 8:
          message.createTime = reader.uint32();
          break;
        case 9:
          message.activeCell = GetActiveCollaboratorsVo_ActiveCell.decode(reader, reader.uint32());
          break;
        case 10:
          message.nickName = reader.string();
          break;
        case 11:
          message.avatarColor = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetActiveCollaboratorsVo_Collaborator {
    return {
      activeDatasheet: isSet(object.activeDatasheet) ? String(object.activeDatasheet) : "",
      socketId: isSet(object.socketId) ? String(object.socketId) : "",
      userName: isSet(object.userName) ? String(object.userName) : undefined,
      memberName: isSet(object.memberName) ? String(object.memberName) : undefined,
      avatar: isSet(object.avatar) ? String(object.avatar) : undefined,
      userId: isSet(object.userId) ? String(object.userId) : undefined,
      shareId: isSet(object.shareId) ? String(object.shareId) : undefined,
      createTime: isSet(object.createTime) ? Number(object.createTime) : undefined,
      activeCell: isSet(object.activeCell)
        ? GetActiveCollaboratorsVo_ActiveCell.fromJSON(object.activeCell)
        : undefined,
      nickName: isSet(object.nickName) ? String(object.nickName) : undefined,
      avatarColor: isSet(object.avatarColor) ? Number(object.avatarColor) : undefined,
    };
  },

  toJSON(message: GetActiveCollaboratorsVo_Collaborator): unknown {
    const obj: any = {};
    message.activeDatasheet !== undefined && (obj.activeDatasheet = message.activeDatasheet);
    message.socketId !== undefined && (obj.socketId = message.socketId);
    message.userName !== undefined && (obj.userName = message.userName);
    message.memberName !== undefined && (obj.memberName = message.memberName);
    message.avatar !== undefined && (obj.avatar = message.avatar);
    message.userId !== undefined && (obj.userId = message.userId);
    message.shareId !== undefined && (obj.shareId = message.shareId);
    message.createTime !== undefined && (obj.createTime = Math.round(message.createTime));
    message.activeCell !== undefined &&
      (obj.activeCell = message.activeCell
        ? GetActiveCollaboratorsVo_ActiveCell.toJSON(message.activeCell)
        : undefined);
    message.nickName !== undefined && (obj.nickName = message.nickName);
    message.avatarColor !== undefined && (obj.avatarColor = Math.round(message.avatarColor));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetActiveCollaboratorsVo_Collaborator>, I>>(
    object: I,
  ): GetActiveCollaboratorsVo_Collaborator {
    const message = Object.create(
      createBaseGetActiveCollaboratorsVo_Collaborator(),
    ) as GetActiveCollaboratorsVo_Collaborator;
    message.activeDatasheet = object.activeDatasheet ?? "";
    message.socketId = object.socketId ?? "";
    message.userName = object.userName ?? undefined;
    message.memberName = object.memberName ?? undefined;
    message.avatar = object.avatar ?? undefined;
    message.userId = object.userId ?? undefined;
    message.shareId = object.shareId ?? undefined;
    message.createTime = object.createTime ?? undefined;
    message.activeCell = (object.activeCell !== undefined && object.activeCell !== null)
      ? GetActiveCollaboratorsVo_ActiveCell.fromPartial(object.activeCell)
      : undefined;
    message.nickName = object.nickName ?? undefined;
    message.avatarColor = object.avatarColor ?? undefined;
    return message;
  },
};

function createBaseGetActiveCollaboratorsVo_Data(): GetActiveCollaboratorsVo_Data {
  return { collaborators: [] };
}

export const GetActiveCollaboratorsVo_Data = {
  encode(message: GetActiveCollaboratorsVo_Data, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.collaborators) {
      GetActiveCollaboratorsVo_Collaborator.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetActiveCollaboratorsVo_Data {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseGetActiveCollaboratorsVo_Data()) as GetActiveCollaboratorsVo_Data;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.collaborators.push(GetActiveCollaboratorsVo_Collaborator.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetActiveCollaboratorsVo_Data {
    return {
      collaborators: Array.isArray(object?.collaborators)
        ? object.collaborators.map((e: any) => GetActiveCollaboratorsVo_Collaborator.fromJSON(e))
        : [],
    };
  },

  toJSON(message: GetActiveCollaboratorsVo_Data): unknown {
    const obj: any = {};
    if (message.collaborators) {
      obj.collaborators = message.collaborators.map((e) =>
        e ? GetActiveCollaboratorsVo_Collaborator.toJSON(e) : undefined
      );
    } else {
      obj.collaborators = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetActiveCollaboratorsVo_Data>, I>>(
    object: I,
  ): GetActiveCollaboratorsVo_Data {
    const message = Object.create(createBaseGetActiveCollaboratorsVo_Data()) as GetActiveCollaboratorsVo_Data;
    message.collaborators = object.collaborators?.map((e) => GetActiveCollaboratorsVo_Collaborator.fromPartial(e)) ||
      [];
    return message;
  },
};

function createBaseLeaveRoomRo(): LeaveRoomRo {
  return { clientId: "" };
}

export const LeaveRoomRo = {
  encode(message: LeaveRoomRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.clientId !== "") {
      writer.uint32(10).string(message.clientId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): LeaveRoomRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseLeaveRoomRo()) as LeaveRoomRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.clientId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): LeaveRoomRo {
    return { clientId: isSet(object.clientId) ? String(object.clientId) : "" };
  },

  toJSON(message: LeaveRoomRo): unknown {
    const obj: any = {};
    message.clientId !== undefined && (obj.clientId = message.clientId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<LeaveRoomRo>, I>>(object: I): LeaveRoomRo {
    const message = Object.create(createBaseLeaveRoomRo()) as LeaveRoomRo;
    message.clientId = object.clientId ?? "";
    return message;
  },
};

function createBaseUserRoomChangeRo(): UserRoomChangeRo {
  return { cookie: "", type: "", roomId: "", changesets: undefined, shareId: undefined, clientId: "" };
}

export const UserRoomChangeRo = {
  encode(message: UserRoomChangeRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.cookie !== "") {
      writer.uint32(10).string(message.cookie);
    }
    if (message.type !== "") {
      writer.uint32(18).string(message.type);
    }
    if (message.roomId !== "") {
      writer.uint32(26).string(message.roomId);
    }
    if (message.changesets !== undefined) {
      Any.encode(message.changesets, writer.uint32(34).fork()).ldelim();
    }
    if (message.shareId !== undefined) {
      writer.uint32(42).string(message.shareId);
    }
    if (message.clientId !== "") {
      writer.uint32(50).string(message.clientId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserRoomChangeRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseUserRoomChangeRo()) as UserRoomChangeRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.cookie = reader.string();
          break;
        case 2:
          message.type = reader.string();
          break;
        case 3:
          message.roomId = reader.string();
          break;
        case 4:
          message.changesets = Any.decode(reader, reader.uint32());
          break;
        case 5:
          message.shareId = reader.string();
          break;
        case 6:
          message.clientId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserRoomChangeRo {
    return {
      cookie: isSet(object.cookie) ? String(object.cookie) : "",
      type: isSet(object.type) ? String(object.type) : "",
      roomId: isSet(object.roomId) ? String(object.roomId) : "",
      changesets: isSet(object.changesets) ? Any.fromJSON(object.changesets) : undefined,
      shareId: isSet(object.shareId) ? String(object.shareId) : undefined,
      clientId: isSet(object.clientId) ? String(object.clientId) : "",
    };
  },

  toJSON(message: UserRoomChangeRo): unknown {
    const obj: any = {};
    message.cookie !== undefined && (obj.cookie = message.cookie);
    message.type !== undefined && (obj.type = message.type);
    message.roomId !== undefined && (obj.roomId = message.roomId);
    message.changesets !== undefined &&
      (obj.changesets = message.changesets ? Any.toJSON(message.changesets) : undefined);
    message.shareId !== undefined && (obj.shareId = message.shareId);
    message.clientId !== undefined && (obj.clientId = message.clientId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UserRoomChangeRo>, I>>(object: I): UserRoomChangeRo {
    const message = Object.create(createBaseUserRoomChangeRo()) as UserRoomChangeRo;
    message.cookie = object.cookie ?? "";
    message.type = object.type ?? "";
    message.roomId = object.roomId ?? "";
    message.changesets = (object.changesets !== undefined && object.changesets !== null)
      ? Any.fromPartial(object.changesets)
      : undefined;
    message.shareId = object.shareId ?? undefined;
    message.clientId = object.clientId ?? "";
    return message;
  },
};

function createBaseUserRoomChangeVo(): UserRoomChangeVo {
  return { success: false, code: 0, message: "", data: undefined };
}

export const UserRoomChangeVo = {
  encode(message: UserRoomChangeVo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.success === true) {
      writer.uint32(8).bool(message.success);
    }
    if (message.code !== 0) {
      writer.uint32(16).int32(message.code);
    }
    if (message.message !== "") {
      writer.uint32(26).string(message.message);
    }
    if (message.data !== undefined) {
      Any.encode(message.data, writer.uint32(34).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserRoomChangeVo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseUserRoomChangeVo()) as UserRoomChangeVo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.success = reader.bool();
          break;
        case 2:
          message.code = reader.int32();
          break;
        case 3:
          message.message = reader.string();
          break;
        case 4:
          message.data = Any.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserRoomChangeVo {
    return {
      success: isSet(object.success) ? Boolean(object.success) : false,
      code: isSet(object.code) ? Number(object.code) : 0,
      message: isSet(object.message) ? String(object.message) : "",
      data: isSet(object.data) ? Any.fromJSON(object.data) : undefined,
    };
  },

  toJSON(message: UserRoomChangeVo): unknown {
    const obj: any = {};
    message.success !== undefined && (obj.success = message.success);
    message.code !== undefined && (obj.code = Math.round(message.code));
    message.message !== undefined && (obj.message = message.message);
    message.data !== undefined && (obj.data = message.data ? Any.toJSON(message.data) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UserRoomChangeVo>, I>>(object: I): UserRoomChangeVo {
    const message = Object.create(createBaseUserRoomChangeVo()) as UserRoomChangeVo;
    message.success = object.success ?? false;
    message.code = object.code ?? 0;
    message.message = object.message ?? "";
    message.data = (object.data !== undefined && object.data !== null) ? Any.fromPartial(object.data) : undefined;
    return message;
  },
};

function createBaseNodeCopyRo(): NodeCopyRo {
  return { nodeId: "", copyNodeId: "", userId: "", uuid: "", fieldIds: [] };
}

export const NodeCopyRo = {
  encode(message: NodeCopyRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.nodeId !== "") {
      writer.uint32(10).string(message.nodeId);
    }
    if (message.copyNodeId !== "") {
      writer.uint32(18).string(message.copyNodeId);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.uuid !== "") {
      writer.uint32(34).string(message.uuid);
    }
    for (const v of message.fieldIds) {
      writer.uint32(42).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NodeCopyRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseNodeCopyRo()) as NodeCopyRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.nodeId = reader.string();
          break;
        case 2:
          message.copyNodeId = reader.string();
          break;
        case 3:
          message.userId = reader.string();
          break;
        case 4:
          message.uuid = reader.string();
          break;
        case 5:
          message.fieldIds.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NodeCopyRo {
    return {
      nodeId: isSet(object.nodeId) ? String(object.nodeId) : "",
      copyNodeId: isSet(object.copyNodeId) ? String(object.copyNodeId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
      uuid: isSet(object.uuid) ? String(object.uuid) : "",
      fieldIds: Array.isArray(object?.fieldIds) ? object.fieldIds.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: NodeCopyRo): unknown {
    const obj: any = {};
    message.nodeId !== undefined && (obj.nodeId = message.nodeId);
    message.copyNodeId !== undefined && (obj.copyNodeId = message.copyNodeId);
    message.userId !== undefined && (obj.userId = message.userId);
    message.uuid !== undefined && (obj.uuid = message.uuid);
    if (message.fieldIds) {
      obj.fieldIds = message.fieldIds.map((e) => e);
    } else {
      obj.fieldIds = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NodeCopyRo>, I>>(object: I): NodeCopyRo {
    const message = Object.create(createBaseNodeCopyRo()) as NodeCopyRo;
    message.nodeId = object.nodeId ?? "";
    message.copyNodeId = object.copyNodeId ?? "";
    message.userId = object.userId ?? "";
    message.uuid = object.uuid ?? "";
    message.fieldIds = object.fieldIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseNodeDeleteRo(): NodeDeleteRo {
  return { deleteNodeId: [], linkNodeId: [], userId: "", uuid: "" };
}

export const NodeDeleteRo = {
  encode(message: NodeDeleteRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.deleteNodeId) {
      writer.uint32(10).string(v!);
    }
    for (const v of message.linkNodeId) {
      writer.uint32(18).string(v!);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    if (message.uuid !== "") {
      writer.uint32(34).string(message.uuid);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): NodeDeleteRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseNodeDeleteRo()) as NodeDeleteRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.deleteNodeId.push(reader.string());
          break;
        case 2:
          message.linkNodeId.push(reader.string());
          break;
        case 3:
          message.userId = reader.string();
          break;
        case 4:
          message.uuid = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): NodeDeleteRo {
    return {
      deleteNodeId: Array.isArray(object?.deleteNodeId) ? object.deleteNodeId.map((e: any) => String(e)) : [],
      linkNodeId: Array.isArray(object?.linkNodeId) ? object.linkNodeId.map((e: any) => String(e)) : [],
      userId: isSet(object.userId) ? String(object.userId) : "",
      uuid: isSet(object.uuid) ? String(object.uuid) : "",
    };
  },

  toJSON(message: NodeDeleteRo): unknown {
    const obj: any = {};
    if (message.deleteNodeId) {
      obj.deleteNodeId = message.deleteNodeId.map((e) => e);
    } else {
      obj.deleteNodeId = [];
    }
    if (message.linkNodeId) {
      obj.linkNodeId = message.linkNodeId.map((e) => e);
    } else {
      obj.linkNodeId = [];
    }
    message.userId !== undefined && (obj.userId = message.userId);
    message.uuid !== undefined && (obj.uuid = message.uuid);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<NodeDeleteRo>, I>>(object: I): NodeDeleteRo {
    const message = Object.create(createBaseNodeDeleteRo()) as NodeDeleteRo;
    message.deleteNodeId = object.deleteNodeId?.map((e) => e) || [];
    message.linkNodeId = object.linkNodeId?.map((e) => e) || [];
    message.userId = object.userId ?? "";
    message.uuid = object.uuid ?? "";
    return message;
  },
};

/**
 * room-server provided service
 * socket->room
 */
export interface RoomServingService {
  /** user join datasheet room */
  watchRoom(request: WatchRoomRo, metadata?: Metadata): Observable<WatchRoomVo>;
  /** user leave datasheet room */
  leaveRoom(request: LeaveRoomRo, metadata?: Metadata): Observable<BasicResult>;
  /** User Modification datasheet */
  roomChange(request: UserRoomChangeRo, metadata?: Metadata): Observable<UserRoomChangeVo>;
  /** Get all active users in the current room */
  getActiveCollaborators(request: WatchRoomRo, metadata?: Metadata): Observable<GetActiveCollaboratorsVo>;
  /** Server sends room Change event */
  serverRoomChange(request: ServerRoomChangeRo, metadata?: Metadata): Observable<BasicResult>;
  /** copy datasheet effect ot */
  copyNodeEffectOt(request: NodeCopyRo, metadata?: Metadata): Observable<BasicResult>;
  /** delete datasheet effect ot */
  deleteNodeEffectOt(request: NodeDeleteRo, metadata?: Metadata): Observable<BasicResult>;
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
