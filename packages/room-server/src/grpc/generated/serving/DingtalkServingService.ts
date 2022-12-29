/* eslint-disable */
import { Metadata } from "@grpc/grpc-js";
import _m0 from "protobufjs/minimal";
import { Observable } from "rxjs";
import { Any } from "../google/protobuf/any";

export const protobufPackage = "grpc.dingtalk";

export interface DeptUserListRo {
  suiteId: string;
  authCorpId: string;
  deptId: string;
  cursor: number;
  size: number;
}

export interface DepartmentSubIdRo {
  suiteId: string;
  authCorpId: string;
  deptId: string;
}

export interface UserDetailRo {
  suiteId: string;
  authCorpId: string;
  userId: string;
}

export interface GetSocialTenantStatusRo {
  suiteId: string;
  authCorpId: string;
}

export interface GetUserInfoByCodeRo {
  suiteId: string;
  authCorpId: string;
  code: string;
}

export interface GetSsoUserInfoByCodeRo {
  suiteId: string;
  code: string;
}

export interface SendMessageToUserByTemplateIdRo {
  suiteId: string;
  authCorpId: string;
  agentId: string;
  data: string;
  userIds: string[];
  templateId: string;
}

export interface UploadMediaRo {
  suiteId: string;
  authCorpId: string;
  mediaType: string;
  fileBytes: Uint8Array;
  fileName: string;
}

export interface CreateMicroApaasAppRo {
  suiteId: string;
  authCorpId: string;
  appName: string;
  appDesc: string;
  appIcon: string;
  homepageLink: string;
  pcHomepageLink: string;
  ompLink: string;
  homepageEditLink: string;
  pcHomepageEditLink: string;
  opUserId: string;
  bizAppId: string;
  templateKey: string;
}

export interface GetInternalSkuPageRo {
  suiteId: string;
  authCorpId: string;
  goodsCode: string;
  callbackPage: string;
  extendParam: string;
}

export interface InternalOrderFinishRo {
  suiteId: string;
  authCorpId: string;
  orderId: string;
}

export interface GetInternalOrderRo {
  suiteId: string;
  authCorpId: string;
  orderId: string;
}

export interface GetDdConfigSignRo {
  suiteId: string;
  authCorpId: string;
  nonceStr: string;
  timestamp: string;
  url: string;
}

export interface GetUserCountRo {
  suiteId: string;
  authCorpId: string;
  onlyActive: boolean;
}

export interface GetUserTreeListRo {
  suiteId: string;
  authCorpId: string;
  subDeptIds: string[];
}

export interface GetUserIdListByDeptIdRo {
  suiteId: string;
  authCorpId: string;
  deptId: string;
}

export interface GetCorpBizDataRo {
  suiteId: string;
  authCorpId: string;
  bizTypes: number[];
}

export interface RequestIdResult {
  requestId: string;
  result: Any | undefined;
}

export interface DingTalkSsoUserInfoResult {
  errcode: number;
  errmsg: string;
  userInfo: Any | undefined;
  isSys: boolean;
  corpInfo: Any | undefined;
}

export interface AsyncSendMessageResult {
  requestId: string;
  taskId: string;
}

export interface CreateMicroApaasAppResult {
  agentId: string;
  bizAppId: string;
}

export interface TenantInfoResult {
  tenantId: string;
  agentId: string;
  status: boolean;
}

export interface UserTreeListResult {
  userTreeList: { [key: string]: DingTalkUserDto };
}

export interface UserTreeListResult_UserTreeListEntry {
  key: string;
  value: DingTalkUserDto | undefined;
}

export interface CorpBizDataResult {
  result: CorpBizDataDto[];
}

export interface DingTalkUserDto {
  openId: string;
  userName: string;
  avatar: string;
  unionId: string;
}

export interface CorpBizDataDto {
  bizType: number;
  bizId: string;
  bizData: string;
}

function createBaseDeptUserListRo(): DeptUserListRo {
  return { suiteId: "", authCorpId: "", deptId: "", cursor: 0, size: 0 };
}

export const DeptUserListRo = {
  encode(message: DeptUserListRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    if (message.deptId !== "") {
      writer.uint32(26).string(message.deptId);
    }
    if (message.cursor !== 0) {
      writer.uint32(32).int32(message.cursor);
    }
    if (message.size !== 0) {
      writer.uint32(40).int32(message.size);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DeptUserListRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseDeptUserListRo()) as DeptUserListRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          message.deptId = reader.string();
          break;
        case 4:
          message.cursor = reader.int32();
          break;
        case 5:
          message.size = reader.int32();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DeptUserListRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      deptId: isSet(object.deptId) ? String(object.deptId) : "",
      cursor: isSet(object.cursor) ? Number(object.cursor) : 0,
      size: isSet(object.size) ? Number(object.size) : 0,
    };
  },

  toJSON(message: DeptUserListRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    message.deptId !== undefined && (obj.deptId = message.deptId);
    message.cursor !== undefined && (obj.cursor = Math.round(message.cursor));
    message.size !== undefined && (obj.size = Math.round(message.size));
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DeptUserListRo>, I>>(object: I): DeptUserListRo {
    const message = Object.create(createBaseDeptUserListRo()) as DeptUserListRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.deptId = object.deptId ?? "";
    message.cursor = object.cursor ?? 0;
    message.size = object.size ?? 0;
    return message;
  },
};

function createBaseDepartmentSubIdRo(): DepartmentSubIdRo {
  return { suiteId: "", authCorpId: "", deptId: "" };
}

export const DepartmentSubIdRo = {
  encode(message: DepartmentSubIdRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    if (message.deptId !== "") {
      writer.uint32(26).string(message.deptId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DepartmentSubIdRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseDepartmentSubIdRo()) as DepartmentSubIdRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          message.deptId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DepartmentSubIdRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      deptId: isSet(object.deptId) ? String(object.deptId) : "",
    };
  },

  toJSON(message: DepartmentSubIdRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    message.deptId !== undefined && (obj.deptId = message.deptId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DepartmentSubIdRo>, I>>(object: I): DepartmentSubIdRo {
    const message = Object.create(createBaseDepartmentSubIdRo()) as DepartmentSubIdRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.deptId = object.deptId ?? "";
    return message;
  },
};

function createBaseUserDetailRo(): UserDetailRo {
  return { suiteId: "", authCorpId: "", userId: "" };
}

export const UserDetailRo = {
  encode(message: UserDetailRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    if (message.userId !== "") {
      writer.uint32(26).string(message.userId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserDetailRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseUserDetailRo()) as UserDetailRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          message.userId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserDetailRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      userId: isSet(object.userId) ? String(object.userId) : "",
    };
  },

  toJSON(message: UserDetailRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    message.userId !== undefined && (obj.userId = message.userId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UserDetailRo>, I>>(object: I): UserDetailRo {
    const message = Object.create(createBaseUserDetailRo()) as UserDetailRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.userId = object.userId ?? "";
    return message;
  },
};

function createBaseGetSocialTenantStatusRo(): GetSocialTenantStatusRo {
  return { suiteId: "", authCorpId: "" };
}

export const GetSocialTenantStatusRo = {
  encode(message: GetSocialTenantStatusRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetSocialTenantStatusRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseGetSocialTenantStatusRo()) as GetSocialTenantStatusRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetSocialTenantStatusRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
    };
  },

  toJSON(message: GetSocialTenantStatusRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetSocialTenantStatusRo>, I>>(object: I): GetSocialTenantStatusRo {
    const message = Object.create(createBaseGetSocialTenantStatusRo()) as GetSocialTenantStatusRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    return message;
  },
};

function createBaseGetUserInfoByCodeRo(): GetUserInfoByCodeRo {
  return { suiteId: "", authCorpId: "", code: "" };
}

export const GetUserInfoByCodeRo = {
  encode(message: GetUserInfoByCodeRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    if (message.code !== "") {
      writer.uint32(26).string(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserInfoByCodeRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseGetUserInfoByCodeRo()) as GetUserInfoByCodeRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          message.code = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserInfoByCodeRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      code: isSet(object.code) ? String(object.code) : "",
    };
  },

  toJSON(message: GetUserInfoByCodeRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    message.code !== undefined && (obj.code = message.code);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetUserInfoByCodeRo>, I>>(object: I): GetUserInfoByCodeRo {
    const message = Object.create(createBaseGetUserInfoByCodeRo()) as GetUserInfoByCodeRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.code = object.code ?? "";
    return message;
  },
};

function createBaseGetSsoUserInfoByCodeRo(): GetSsoUserInfoByCodeRo {
  return { suiteId: "", code: "" };
}

export const GetSsoUserInfoByCodeRo = {
  encode(message: GetSsoUserInfoByCodeRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.code !== "") {
      writer.uint32(18).string(message.code);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetSsoUserInfoByCodeRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseGetSsoUserInfoByCodeRo()) as GetSsoUserInfoByCodeRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.code = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetSsoUserInfoByCodeRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      code: isSet(object.code) ? String(object.code) : "",
    };
  },

  toJSON(message: GetSsoUserInfoByCodeRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.code !== undefined && (obj.code = message.code);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetSsoUserInfoByCodeRo>, I>>(object: I): GetSsoUserInfoByCodeRo {
    const message = Object.create(createBaseGetSsoUserInfoByCodeRo()) as GetSsoUserInfoByCodeRo;
    message.suiteId = object.suiteId ?? "";
    message.code = object.code ?? "";
    return message;
  },
};

function createBaseSendMessageToUserByTemplateIdRo(): SendMessageToUserByTemplateIdRo {
  return { suiteId: "", authCorpId: "", agentId: "", data: "", userIds: [], templateId: "" };
}

export const SendMessageToUserByTemplateIdRo = {
  encode(message: SendMessageToUserByTemplateIdRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    if (message.agentId !== "") {
      writer.uint32(26).string(message.agentId);
    }
    if (message.data !== "") {
      writer.uint32(34).string(message.data);
    }
    for (const v of message.userIds) {
      writer.uint32(42).string(v!);
    }
    if (message.templateId !== "") {
      writer.uint32(50).string(message.templateId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): SendMessageToUserByTemplateIdRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseSendMessageToUserByTemplateIdRo()) as SendMessageToUserByTemplateIdRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          message.agentId = reader.string();
          break;
        case 4:
          message.data = reader.string();
          break;
        case 5:
          message.userIds.push(reader.string());
          break;
        case 6:
          message.templateId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): SendMessageToUserByTemplateIdRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      agentId: isSet(object.agentId) ? String(object.agentId) : "",
      data: isSet(object.data) ? String(object.data) : "",
      userIds: Array.isArray(object?.userIds) ? object.userIds.map((e: any) => String(e)) : [],
      templateId: isSet(object.templateId) ? String(object.templateId) : "",
    };
  },

  toJSON(message: SendMessageToUserByTemplateIdRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    message.agentId !== undefined && (obj.agentId = message.agentId);
    message.data !== undefined && (obj.data = message.data);
    if (message.userIds) {
      obj.userIds = message.userIds.map((e) => e);
    } else {
      obj.userIds = [];
    }
    message.templateId !== undefined && (obj.templateId = message.templateId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<SendMessageToUserByTemplateIdRo>, I>>(
    object: I,
  ): SendMessageToUserByTemplateIdRo {
    const message = Object.create(createBaseSendMessageToUserByTemplateIdRo()) as SendMessageToUserByTemplateIdRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.agentId = object.agentId ?? "";
    message.data = object.data ?? "";
    message.userIds = object.userIds?.map((e) => e) || [];
    message.templateId = object.templateId ?? "";
    return message;
  },
};

function createBaseUploadMediaRo(): UploadMediaRo {
  return { suiteId: "", authCorpId: "", mediaType: "", fileBytes: new Uint8Array(), fileName: "" };
}

export const UploadMediaRo = {
  encode(message: UploadMediaRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    if (message.mediaType !== "") {
      writer.uint32(26).string(message.mediaType);
    }
    if (message.fileBytes.length !== 0) {
      writer.uint32(34).bytes(message.fileBytes);
    }
    if (message.fileName !== "") {
      writer.uint32(42).string(message.fileName);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UploadMediaRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseUploadMediaRo()) as UploadMediaRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          message.mediaType = reader.string();
          break;
        case 4:
          message.fileBytes = reader.bytes();
          break;
        case 5:
          message.fileName = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UploadMediaRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      mediaType: isSet(object.mediaType) ? String(object.mediaType) : "",
      fileBytes: isSet(object.fileBytes) ? bytesFromBase64(object.fileBytes) : new Uint8Array(),
      fileName: isSet(object.fileName) ? String(object.fileName) : "",
    };
  },

  toJSON(message: UploadMediaRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    message.mediaType !== undefined && (obj.mediaType = message.mediaType);
    message.fileBytes !== undefined &&
      (obj.fileBytes = base64FromBytes(message.fileBytes !== undefined ? message.fileBytes : new Uint8Array()));
    message.fileName !== undefined && (obj.fileName = message.fileName);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UploadMediaRo>, I>>(object: I): UploadMediaRo {
    const message = Object.create(createBaseUploadMediaRo()) as UploadMediaRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.mediaType = object.mediaType ?? "";
    message.fileBytes = object.fileBytes ?? new Uint8Array();
    message.fileName = object.fileName ?? "";
    return message;
  },
};

function createBaseCreateMicroApaasAppRo(): CreateMicroApaasAppRo {
  return {
    suiteId: "",
    authCorpId: "",
    appName: "",
    appDesc: "",
    appIcon: "",
    homepageLink: "",
    pcHomepageLink: "",
    ompLink: "",
    homepageEditLink: "",
    pcHomepageEditLink: "",
    opUserId: "",
    bizAppId: "",
    templateKey: "",
  };
}

export const CreateMicroApaasAppRo = {
  encode(message: CreateMicroApaasAppRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    if (message.appName !== "") {
      writer.uint32(26).string(message.appName);
    }
    if (message.appDesc !== "") {
      writer.uint32(34).string(message.appDesc);
    }
    if (message.appIcon !== "") {
      writer.uint32(42).string(message.appIcon);
    }
    if (message.homepageLink !== "") {
      writer.uint32(50).string(message.homepageLink);
    }
    if (message.pcHomepageLink !== "") {
      writer.uint32(58).string(message.pcHomepageLink);
    }
    if (message.ompLink !== "") {
      writer.uint32(66).string(message.ompLink);
    }
    if (message.homepageEditLink !== "") {
      writer.uint32(74).string(message.homepageEditLink);
    }
    if (message.pcHomepageEditLink !== "") {
      writer.uint32(82).string(message.pcHomepageEditLink);
    }
    if (message.opUserId !== "") {
      writer.uint32(90).string(message.opUserId);
    }
    if (message.bizAppId !== "") {
      writer.uint32(98).string(message.bizAppId);
    }
    if (message.templateKey !== "") {
      writer.uint32(106).string(message.templateKey);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateMicroApaasAppRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseCreateMicroApaasAppRo()) as CreateMicroApaasAppRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          message.appName = reader.string();
          break;
        case 4:
          message.appDesc = reader.string();
          break;
        case 5:
          message.appIcon = reader.string();
          break;
        case 6:
          message.homepageLink = reader.string();
          break;
        case 7:
          message.pcHomepageLink = reader.string();
          break;
        case 8:
          message.ompLink = reader.string();
          break;
        case 9:
          message.homepageEditLink = reader.string();
          break;
        case 10:
          message.pcHomepageEditLink = reader.string();
          break;
        case 11:
          message.opUserId = reader.string();
          break;
        case 12:
          message.bizAppId = reader.string();
          break;
        case 13:
          message.templateKey = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateMicroApaasAppRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      appName: isSet(object.appName) ? String(object.appName) : "",
      appDesc: isSet(object.appDesc) ? String(object.appDesc) : "",
      appIcon: isSet(object.appIcon) ? String(object.appIcon) : "",
      homepageLink: isSet(object.homepageLink) ? String(object.homepageLink) : "",
      pcHomepageLink: isSet(object.pcHomepageLink) ? String(object.pcHomepageLink) : "",
      ompLink: isSet(object.ompLink) ? String(object.ompLink) : "",
      homepageEditLink: isSet(object.homepageEditLink) ? String(object.homepageEditLink) : "",
      pcHomepageEditLink: isSet(object.pcHomepageEditLink) ? String(object.pcHomepageEditLink) : "",
      opUserId: isSet(object.opUserId) ? String(object.opUserId) : "",
      bizAppId: isSet(object.bizAppId) ? String(object.bizAppId) : "",
      templateKey: isSet(object.templateKey) ? String(object.templateKey) : "",
    };
  },

  toJSON(message: CreateMicroApaasAppRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    message.appName !== undefined && (obj.appName = message.appName);
    message.appDesc !== undefined && (obj.appDesc = message.appDesc);
    message.appIcon !== undefined && (obj.appIcon = message.appIcon);
    message.homepageLink !== undefined && (obj.homepageLink = message.homepageLink);
    message.pcHomepageLink !== undefined && (obj.pcHomepageLink = message.pcHomepageLink);
    message.ompLink !== undefined && (obj.ompLink = message.ompLink);
    message.homepageEditLink !== undefined && (obj.homepageEditLink = message.homepageEditLink);
    message.pcHomepageEditLink !== undefined && (obj.pcHomepageEditLink = message.pcHomepageEditLink);
    message.opUserId !== undefined && (obj.opUserId = message.opUserId);
    message.bizAppId !== undefined && (obj.bizAppId = message.bizAppId);
    message.templateKey !== undefined && (obj.templateKey = message.templateKey);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreateMicroApaasAppRo>, I>>(object: I): CreateMicroApaasAppRo {
    const message = Object.create(createBaseCreateMicroApaasAppRo()) as CreateMicroApaasAppRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.appName = object.appName ?? "";
    message.appDesc = object.appDesc ?? "";
    message.appIcon = object.appIcon ?? "";
    message.homepageLink = object.homepageLink ?? "";
    message.pcHomepageLink = object.pcHomepageLink ?? "";
    message.ompLink = object.ompLink ?? "";
    message.homepageEditLink = object.homepageEditLink ?? "";
    message.pcHomepageEditLink = object.pcHomepageEditLink ?? "";
    message.opUserId = object.opUserId ?? "";
    message.bizAppId = object.bizAppId ?? "";
    message.templateKey = object.templateKey ?? "";
    return message;
  },
};

function createBaseGetInternalSkuPageRo(): GetInternalSkuPageRo {
  return { suiteId: "", authCorpId: "", goodsCode: "", callbackPage: "", extendParam: "" };
}

export const GetInternalSkuPageRo = {
  encode(message: GetInternalSkuPageRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    if (message.goodsCode !== "") {
      writer.uint32(26).string(message.goodsCode);
    }
    if (message.callbackPage !== "") {
      writer.uint32(34).string(message.callbackPage);
    }
    if (message.extendParam !== "") {
      writer.uint32(42).string(message.extendParam);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetInternalSkuPageRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseGetInternalSkuPageRo()) as GetInternalSkuPageRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          message.goodsCode = reader.string();
          break;
        case 4:
          message.callbackPage = reader.string();
          break;
        case 5:
          message.extendParam = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetInternalSkuPageRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      goodsCode: isSet(object.goodsCode) ? String(object.goodsCode) : "",
      callbackPage: isSet(object.callbackPage) ? String(object.callbackPage) : "",
      extendParam: isSet(object.extendParam) ? String(object.extendParam) : "",
    };
  },

  toJSON(message: GetInternalSkuPageRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    message.goodsCode !== undefined && (obj.goodsCode = message.goodsCode);
    message.callbackPage !== undefined && (obj.callbackPage = message.callbackPage);
    message.extendParam !== undefined && (obj.extendParam = message.extendParam);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetInternalSkuPageRo>, I>>(object: I): GetInternalSkuPageRo {
    const message = Object.create(createBaseGetInternalSkuPageRo()) as GetInternalSkuPageRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.goodsCode = object.goodsCode ?? "";
    message.callbackPage = object.callbackPage ?? "";
    message.extendParam = object.extendParam ?? "";
    return message;
  },
};

function createBaseInternalOrderFinishRo(): InternalOrderFinishRo {
  return { suiteId: "", authCorpId: "", orderId: "" };
}

export const InternalOrderFinishRo = {
  encode(message: InternalOrderFinishRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    if (message.orderId !== "") {
      writer.uint32(26).string(message.orderId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): InternalOrderFinishRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseInternalOrderFinishRo()) as InternalOrderFinishRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          message.orderId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): InternalOrderFinishRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
    };
  },

  toJSON(message: InternalOrderFinishRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    message.orderId !== undefined && (obj.orderId = message.orderId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<InternalOrderFinishRo>, I>>(object: I): InternalOrderFinishRo {
    const message = Object.create(createBaseInternalOrderFinishRo()) as InternalOrderFinishRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.orderId = object.orderId ?? "";
    return message;
  },
};

function createBaseGetInternalOrderRo(): GetInternalOrderRo {
  return { suiteId: "", authCorpId: "", orderId: "" };
}

export const GetInternalOrderRo = {
  encode(message: GetInternalOrderRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    if (message.orderId !== "") {
      writer.uint32(26).string(message.orderId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetInternalOrderRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseGetInternalOrderRo()) as GetInternalOrderRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          message.orderId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetInternalOrderRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      orderId: isSet(object.orderId) ? String(object.orderId) : "",
    };
  },

  toJSON(message: GetInternalOrderRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    message.orderId !== undefined && (obj.orderId = message.orderId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetInternalOrderRo>, I>>(object: I): GetInternalOrderRo {
    const message = Object.create(createBaseGetInternalOrderRo()) as GetInternalOrderRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.orderId = object.orderId ?? "";
    return message;
  },
};

function createBaseGetDdConfigSignRo(): GetDdConfigSignRo {
  return { suiteId: "", authCorpId: "", nonceStr: "", timestamp: "", url: "" };
}

export const GetDdConfigSignRo = {
  encode(message: GetDdConfigSignRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    if (message.nonceStr !== "") {
      writer.uint32(26).string(message.nonceStr);
    }
    if (message.timestamp !== "") {
      writer.uint32(34).string(message.timestamp);
    }
    if (message.url !== "") {
      writer.uint32(42).string(message.url);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetDdConfigSignRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseGetDdConfigSignRo()) as GetDdConfigSignRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          message.nonceStr = reader.string();
          break;
        case 4:
          message.timestamp = reader.string();
          break;
        case 5:
          message.url = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetDdConfigSignRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      nonceStr: isSet(object.nonceStr) ? String(object.nonceStr) : "",
      timestamp: isSet(object.timestamp) ? String(object.timestamp) : "",
      url: isSet(object.url) ? String(object.url) : "",
    };
  },

  toJSON(message: GetDdConfigSignRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    message.nonceStr !== undefined && (obj.nonceStr = message.nonceStr);
    message.timestamp !== undefined && (obj.timestamp = message.timestamp);
    message.url !== undefined && (obj.url = message.url);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetDdConfigSignRo>, I>>(object: I): GetDdConfigSignRo {
    const message = Object.create(createBaseGetDdConfigSignRo()) as GetDdConfigSignRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.nonceStr = object.nonceStr ?? "";
    message.timestamp = object.timestamp ?? "";
    message.url = object.url ?? "";
    return message;
  },
};

function createBaseGetUserCountRo(): GetUserCountRo {
  return { suiteId: "", authCorpId: "", onlyActive: false };
}

export const GetUserCountRo = {
  encode(message: GetUserCountRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    if (message.onlyActive === true) {
      writer.uint32(24).bool(message.onlyActive);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserCountRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseGetUserCountRo()) as GetUserCountRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          message.onlyActive = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserCountRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      onlyActive: isSet(object.onlyActive) ? Boolean(object.onlyActive) : false,
    };
  },

  toJSON(message: GetUserCountRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    message.onlyActive !== undefined && (obj.onlyActive = message.onlyActive);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetUserCountRo>, I>>(object: I): GetUserCountRo {
    const message = Object.create(createBaseGetUserCountRo()) as GetUserCountRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.onlyActive = object.onlyActive ?? false;
    return message;
  },
};

function createBaseGetUserTreeListRo(): GetUserTreeListRo {
  return { suiteId: "", authCorpId: "", subDeptIds: [] };
}

export const GetUserTreeListRo = {
  encode(message: GetUserTreeListRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    for (const v of message.subDeptIds) {
      writer.uint32(26).string(v!);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserTreeListRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseGetUserTreeListRo()) as GetUserTreeListRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          message.subDeptIds.push(reader.string());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserTreeListRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      subDeptIds: Array.isArray(object?.subDeptIds) ? object.subDeptIds.map((e: any) => String(e)) : [],
    };
  },

  toJSON(message: GetUserTreeListRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    if (message.subDeptIds) {
      obj.subDeptIds = message.subDeptIds.map((e) => e);
    } else {
      obj.subDeptIds = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetUserTreeListRo>, I>>(object: I): GetUserTreeListRo {
    const message = Object.create(createBaseGetUserTreeListRo()) as GetUserTreeListRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.subDeptIds = object.subDeptIds?.map((e) => e) || [];
    return message;
  },
};

function createBaseGetUserIdListByDeptIdRo(): GetUserIdListByDeptIdRo {
  return { suiteId: "", authCorpId: "", deptId: "" };
}

export const GetUserIdListByDeptIdRo = {
  encode(message: GetUserIdListByDeptIdRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    if (message.deptId !== "") {
      writer.uint32(26).string(message.deptId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetUserIdListByDeptIdRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseGetUserIdListByDeptIdRo()) as GetUserIdListByDeptIdRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          message.deptId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetUserIdListByDeptIdRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      deptId: isSet(object.deptId) ? String(object.deptId) : "",
    };
  },

  toJSON(message: GetUserIdListByDeptIdRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    message.deptId !== undefined && (obj.deptId = message.deptId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetUserIdListByDeptIdRo>, I>>(object: I): GetUserIdListByDeptIdRo {
    const message = Object.create(createBaseGetUserIdListByDeptIdRo()) as GetUserIdListByDeptIdRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.deptId = object.deptId ?? "";
    return message;
  },
};

function createBaseGetCorpBizDataRo(): GetCorpBizDataRo {
  return { suiteId: "", authCorpId: "", bizTypes: [] };
}

export const GetCorpBizDataRo = {
  encode(message: GetCorpBizDataRo, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.suiteId !== "") {
      writer.uint32(10).string(message.suiteId);
    }
    if (message.authCorpId !== "") {
      writer.uint32(18).string(message.authCorpId);
    }
    writer.uint32(26).fork();
    for (const v of message.bizTypes) {
      writer.int32(v);
    }
    writer.ldelim();
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): GetCorpBizDataRo {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseGetCorpBizDataRo()) as GetCorpBizDataRo;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.suiteId = reader.string();
          break;
        case 2:
          message.authCorpId = reader.string();
          break;
        case 3:
          if ((tag & 7) === 2) {
            const end2 = reader.uint32() + reader.pos;
            while (reader.pos < end2) {
              message.bizTypes.push(reader.int32());
            }
          } else {
            message.bizTypes.push(reader.int32());
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): GetCorpBizDataRo {
    return {
      suiteId: isSet(object.suiteId) ? String(object.suiteId) : "",
      authCorpId: isSet(object.authCorpId) ? String(object.authCorpId) : "",
      bizTypes: Array.isArray(object?.bizTypes) ? object.bizTypes.map((e: any) => Number(e)) : [],
    };
  },

  toJSON(message: GetCorpBizDataRo): unknown {
    const obj: any = {};
    message.suiteId !== undefined && (obj.suiteId = message.suiteId);
    message.authCorpId !== undefined && (obj.authCorpId = message.authCorpId);
    if (message.bizTypes) {
      obj.bizTypes = message.bizTypes.map((e) => Math.round(e));
    } else {
      obj.bizTypes = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<GetCorpBizDataRo>, I>>(object: I): GetCorpBizDataRo {
    const message = Object.create(createBaseGetCorpBizDataRo()) as GetCorpBizDataRo;
    message.suiteId = object.suiteId ?? "";
    message.authCorpId = object.authCorpId ?? "";
    message.bizTypes = object.bizTypes?.map((e) => e) || [];
    return message;
  },
};

function createBaseRequestIdResult(): RequestIdResult {
  return { requestId: "", result: undefined };
}

export const RequestIdResult = {
  encode(message: RequestIdResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.requestId !== "") {
      writer.uint32(10).string(message.requestId);
    }
    if (message.result !== undefined) {
      Any.encode(message.result, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): RequestIdResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseRequestIdResult()) as RequestIdResult;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.requestId = reader.string();
          break;
        case 2:
          message.result = Any.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): RequestIdResult {
    return {
      requestId: isSet(object.requestId) ? String(object.requestId) : "",
      result: isSet(object.result) ? Any.fromJSON(object.result) : undefined,
    };
  },

  toJSON(message: RequestIdResult): unknown {
    const obj: any = {};
    message.requestId !== undefined && (obj.requestId = message.requestId);
    message.result !== undefined && (obj.result = message.result ? Any.toJSON(message.result) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<RequestIdResult>, I>>(object: I): RequestIdResult {
    const message = Object.create(createBaseRequestIdResult()) as RequestIdResult;
    message.requestId = object.requestId ?? "";
    message.result = (object.result !== undefined && object.result !== null)
      ? Any.fromPartial(object.result)
      : undefined;
    return message;
  },
};

function createBaseDingTalkSsoUserInfoResult(): DingTalkSsoUserInfoResult {
  return { errcode: 0, errmsg: "", userInfo: undefined, isSys: false, corpInfo: undefined };
}

export const DingTalkSsoUserInfoResult = {
  encode(message: DingTalkSsoUserInfoResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.errcode !== 0) {
      writer.uint32(8).int32(message.errcode);
    }
    if (message.errmsg !== "") {
      writer.uint32(18).string(message.errmsg);
    }
    if (message.userInfo !== undefined) {
      Any.encode(message.userInfo, writer.uint32(26).fork()).ldelim();
    }
    if (message.isSys === true) {
      writer.uint32(32).bool(message.isSys);
    }
    if (message.corpInfo !== undefined) {
      Any.encode(message.corpInfo, writer.uint32(42).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DingTalkSsoUserInfoResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseDingTalkSsoUserInfoResult()) as DingTalkSsoUserInfoResult;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.errcode = reader.int32();
          break;
        case 2:
          message.errmsg = reader.string();
          break;
        case 3:
          message.userInfo = Any.decode(reader, reader.uint32());
          break;
        case 4:
          message.isSys = reader.bool();
          break;
        case 5:
          message.corpInfo = Any.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DingTalkSsoUserInfoResult {
    return {
      errcode: isSet(object.errcode) ? Number(object.errcode) : 0,
      errmsg: isSet(object.errmsg) ? String(object.errmsg) : "",
      userInfo: isSet(object.userInfo) ? Any.fromJSON(object.userInfo) : undefined,
      isSys: isSet(object.isSys) ? Boolean(object.isSys) : false,
      corpInfo: isSet(object.corpInfo) ? Any.fromJSON(object.corpInfo) : undefined,
    };
  },

  toJSON(message: DingTalkSsoUserInfoResult): unknown {
    const obj: any = {};
    message.errcode !== undefined && (obj.errcode = Math.round(message.errcode));
    message.errmsg !== undefined && (obj.errmsg = message.errmsg);
    message.userInfo !== undefined && (obj.userInfo = message.userInfo ? Any.toJSON(message.userInfo) : undefined);
    message.isSys !== undefined && (obj.isSys = message.isSys);
    message.corpInfo !== undefined && (obj.corpInfo = message.corpInfo ? Any.toJSON(message.corpInfo) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DingTalkSsoUserInfoResult>, I>>(object: I): DingTalkSsoUserInfoResult {
    const message = Object.create(createBaseDingTalkSsoUserInfoResult()) as DingTalkSsoUserInfoResult;
    message.errcode = object.errcode ?? 0;
    message.errmsg = object.errmsg ?? "";
    message.userInfo = (object.userInfo !== undefined && object.userInfo !== null)
      ? Any.fromPartial(object.userInfo)
      : undefined;
    message.isSys = object.isSys ?? false;
    message.corpInfo = (object.corpInfo !== undefined && object.corpInfo !== null)
      ? Any.fromPartial(object.corpInfo)
      : undefined;
    return message;
  },
};

function createBaseAsyncSendMessageResult(): AsyncSendMessageResult {
  return { requestId: "", taskId: "" };
}

export const AsyncSendMessageResult = {
  encode(message: AsyncSendMessageResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.requestId !== "") {
      writer.uint32(10).string(message.requestId);
    }
    if (message.taskId !== "") {
      writer.uint32(18).string(message.taskId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): AsyncSendMessageResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseAsyncSendMessageResult()) as AsyncSendMessageResult;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.requestId = reader.string();
          break;
        case 2:
          message.taskId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): AsyncSendMessageResult {
    return {
      requestId: isSet(object.requestId) ? String(object.requestId) : "",
      taskId: isSet(object.taskId) ? String(object.taskId) : "",
    };
  },

  toJSON(message: AsyncSendMessageResult): unknown {
    const obj: any = {};
    message.requestId !== undefined && (obj.requestId = message.requestId);
    message.taskId !== undefined && (obj.taskId = message.taskId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<AsyncSendMessageResult>, I>>(object: I): AsyncSendMessageResult {
    const message = Object.create(createBaseAsyncSendMessageResult()) as AsyncSendMessageResult;
    message.requestId = object.requestId ?? "";
    message.taskId = object.taskId ?? "";
    return message;
  },
};

function createBaseCreateMicroApaasAppResult(): CreateMicroApaasAppResult {
  return { agentId: "", bizAppId: "" };
}

export const CreateMicroApaasAppResult = {
  encode(message: CreateMicroApaasAppResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.agentId !== "") {
      writer.uint32(10).string(message.agentId);
    }
    if (message.bizAppId !== "") {
      writer.uint32(18).string(message.bizAppId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CreateMicroApaasAppResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseCreateMicroApaasAppResult()) as CreateMicroApaasAppResult;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.agentId = reader.string();
          break;
        case 2:
          message.bizAppId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CreateMicroApaasAppResult {
    return {
      agentId: isSet(object.agentId) ? String(object.agentId) : "",
      bizAppId: isSet(object.bizAppId) ? String(object.bizAppId) : "",
    };
  },

  toJSON(message: CreateMicroApaasAppResult): unknown {
    const obj: any = {};
    message.agentId !== undefined && (obj.agentId = message.agentId);
    message.bizAppId !== undefined && (obj.bizAppId = message.bizAppId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CreateMicroApaasAppResult>, I>>(object: I): CreateMicroApaasAppResult {
    const message = Object.create(createBaseCreateMicroApaasAppResult()) as CreateMicroApaasAppResult;
    message.agentId = object.agentId ?? "";
    message.bizAppId = object.bizAppId ?? "";
    return message;
  },
};

function createBaseTenantInfoResult(): TenantInfoResult {
  return { tenantId: "", agentId: "", status: false };
}

export const TenantInfoResult = {
  encode(message: TenantInfoResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.tenantId !== "") {
      writer.uint32(10).string(message.tenantId);
    }
    if (message.agentId !== "") {
      writer.uint32(18).string(message.agentId);
    }
    if (message.status === true) {
      writer.uint32(24).bool(message.status);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): TenantInfoResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseTenantInfoResult()) as TenantInfoResult;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.tenantId = reader.string();
          break;
        case 2:
          message.agentId = reader.string();
          break;
        case 3:
          message.status = reader.bool();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): TenantInfoResult {
    return {
      tenantId: isSet(object.tenantId) ? String(object.tenantId) : "",
      agentId: isSet(object.agentId) ? String(object.agentId) : "",
      status: isSet(object.status) ? Boolean(object.status) : false,
    };
  },

  toJSON(message: TenantInfoResult): unknown {
    const obj: any = {};
    message.tenantId !== undefined && (obj.tenantId = message.tenantId);
    message.agentId !== undefined && (obj.agentId = message.agentId);
    message.status !== undefined && (obj.status = message.status);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<TenantInfoResult>, I>>(object: I): TenantInfoResult {
    const message = Object.create(createBaseTenantInfoResult()) as TenantInfoResult;
    message.tenantId = object.tenantId ?? "";
    message.agentId = object.agentId ?? "";
    message.status = object.status ?? false;
    return message;
  },
};

function createBaseUserTreeListResult(): UserTreeListResult {
  return { userTreeList: {} };
}

export const UserTreeListResult = {
  encode(message: UserTreeListResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    Object.entries(message.userTreeList).forEach(([key, value]) => {
      UserTreeListResult_UserTreeListEntry.encode({ key: key as any, value }, writer.uint32(10).fork()).ldelim();
    });
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserTreeListResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseUserTreeListResult()) as UserTreeListResult;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          const entry1 = UserTreeListResult_UserTreeListEntry.decode(reader, reader.uint32());
          if (entry1.value !== undefined) {
            message.userTreeList[entry1.key] = entry1.value;
          }
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserTreeListResult {
    return {
      userTreeList: isObject(object.userTreeList)
        ? Object.entries(object.userTreeList).reduce<{ [key: string]: DingTalkUserDto }>((acc, [key, value]) => {
          acc[key] = DingTalkUserDto.fromJSON(value);
          return acc;
        }, {})
        : {},
    };
  },

  toJSON(message: UserTreeListResult): unknown {
    const obj: any = {};
    obj.userTreeList = {};
    if (message.userTreeList) {
      Object.entries(message.userTreeList).forEach(([k, v]) => {
        obj.userTreeList[k] = DingTalkUserDto.toJSON(v);
      });
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UserTreeListResult>, I>>(object: I): UserTreeListResult {
    const message = Object.create(createBaseUserTreeListResult()) as UserTreeListResult;
    message.userTreeList = Object.entries(object.userTreeList ?? {}).reduce<{ [key: string]: DingTalkUserDto }>(
      (acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = DingTalkUserDto.fromPartial(value);
        }
        return acc;
      },
      {},
    );
    return message;
  },
};

function createBaseUserTreeListResult_UserTreeListEntry(): UserTreeListResult_UserTreeListEntry {
  return { key: "", value: undefined };
}

export const UserTreeListResult_UserTreeListEntry = {
  encode(message: UserTreeListResult_UserTreeListEntry, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.key !== "") {
      writer.uint32(10).string(message.key);
    }
    if (message.value !== undefined) {
      DingTalkUserDto.encode(message.value, writer.uint32(18).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): UserTreeListResult_UserTreeListEntry {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(
      createBaseUserTreeListResult_UserTreeListEntry(),
    ) as UserTreeListResult_UserTreeListEntry;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.key = reader.string();
          break;
        case 2:
          message.value = DingTalkUserDto.decode(reader, reader.uint32());
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): UserTreeListResult_UserTreeListEntry {
    return {
      key: isSet(object.key) ? String(object.key) : "",
      value: isSet(object.value) ? DingTalkUserDto.fromJSON(object.value) : undefined,
    };
  },

  toJSON(message: UserTreeListResult_UserTreeListEntry): unknown {
    const obj: any = {};
    message.key !== undefined && (obj.key = message.key);
    message.value !== undefined && (obj.value = message.value ? DingTalkUserDto.toJSON(message.value) : undefined);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<UserTreeListResult_UserTreeListEntry>, I>>(
    object: I,
  ): UserTreeListResult_UserTreeListEntry {
    const message = Object.create(
      createBaseUserTreeListResult_UserTreeListEntry(),
    ) as UserTreeListResult_UserTreeListEntry;
    message.key = object.key ?? "";
    message.value = (object.value !== undefined && object.value !== null)
      ? DingTalkUserDto.fromPartial(object.value)
      : undefined;
    return message;
  },
};

function createBaseCorpBizDataResult(): CorpBizDataResult {
  return { result: [] };
}

export const CorpBizDataResult = {
  encode(message: CorpBizDataResult, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    for (const v of message.result) {
      CorpBizDataDto.encode(v!, writer.uint32(10).fork()).ldelim();
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CorpBizDataResult {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseCorpBizDataResult()) as CorpBizDataResult;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.result.push(CorpBizDataDto.decode(reader, reader.uint32()));
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CorpBizDataResult {
    return { result: Array.isArray(object?.result) ? object.result.map((e: any) => CorpBizDataDto.fromJSON(e)) : [] };
  },

  toJSON(message: CorpBizDataResult): unknown {
    const obj: any = {};
    if (message.result) {
      obj.result = message.result.map((e) => e ? CorpBizDataDto.toJSON(e) : undefined);
    } else {
      obj.result = [];
    }
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CorpBizDataResult>, I>>(object: I): CorpBizDataResult {
    const message = Object.create(createBaseCorpBizDataResult()) as CorpBizDataResult;
    message.result = object.result?.map((e) => CorpBizDataDto.fromPartial(e)) || [];
    return message;
  },
};

function createBaseDingTalkUserDto(): DingTalkUserDto {
  return { openId: "", userName: "", avatar: "", unionId: "" };
}

export const DingTalkUserDto = {
  encode(message: DingTalkUserDto, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.openId !== "") {
      writer.uint32(10).string(message.openId);
    }
    if (message.userName !== "") {
      writer.uint32(18).string(message.userName);
    }
    if (message.avatar !== "") {
      writer.uint32(26).string(message.avatar);
    }
    if (message.unionId !== "") {
      writer.uint32(34).string(message.unionId);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): DingTalkUserDto {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseDingTalkUserDto()) as DingTalkUserDto;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.openId = reader.string();
          break;
        case 2:
          message.userName = reader.string();
          break;
        case 3:
          message.avatar = reader.string();
          break;
        case 4:
          message.unionId = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): DingTalkUserDto {
    return {
      openId: isSet(object.openId) ? String(object.openId) : "",
      userName: isSet(object.userName) ? String(object.userName) : "",
      avatar: isSet(object.avatar) ? String(object.avatar) : "",
      unionId: isSet(object.unionId) ? String(object.unionId) : "",
    };
  },

  toJSON(message: DingTalkUserDto): unknown {
    const obj: any = {};
    message.openId !== undefined && (obj.openId = message.openId);
    message.userName !== undefined && (obj.userName = message.userName);
    message.avatar !== undefined && (obj.avatar = message.avatar);
    message.unionId !== undefined && (obj.unionId = message.unionId);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<DingTalkUserDto>, I>>(object: I): DingTalkUserDto {
    const message = Object.create(createBaseDingTalkUserDto()) as DingTalkUserDto;
    message.openId = object.openId ?? "";
    message.userName = object.userName ?? "";
    message.avatar = object.avatar ?? "";
    message.unionId = object.unionId ?? "";
    return message;
  },
};

function createBaseCorpBizDataDto(): CorpBizDataDto {
  return { bizType: 0, bizId: "", bizData: "" };
}

export const CorpBizDataDto = {
  encode(message: CorpBizDataDto, writer: _m0.Writer = _m0.Writer.create()): _m0.Writer {
    if (message.bizType !== 0) {
      writer.uint32(8).int32(message.bizType);
    }
    if (message.bizId !== "") {
      writer.uint32(18).string(message.bizId);
    }
    if (message.bizData !== "") {
      writer.uint32(26).string(message.bizData);
    }
    return writer;
  },

  decode(input: _m0.Reader | Uint8Array, length?: number): CorpBizDataDto {
    const reader = input instanceof _m0.Reader ? input : new _m0.Reader(input);
    let end = length === undefined ? reader.len : reader.pos + length;
    const message = Object.create(createBaseCorpBizDataDto()) as CorpBizDataDto;
    while (reader.pos < end) {
      const tag = reader.uint32();
      switch (tag >>> 3) {
        case 1:
          message.bizType = reader.int32();
          break;
        case 2:
          message.bizId = reader.string();
          break;
        case 3:
          message.bizData = reader.string();
          break;
        default:
          reader.skipType(tag & 7);
          break;
      }
    }
    return message;
  },

  fromJSON(object: any): CorpBizDataDto {
    return {
      bizType: isSet(object.bizType) ? Number(object.bizType) : 0,
      bizId: isSet(object.bizId) ? String(object.bizId) : "",
      bizData: isSet(object.bizData) ? String(object.bizData) : "",
    };
  },

  toJSON(message: CorpBizDataDto): unknown {
    const obj: any = {};
    message.bizType !== undefined && (obj.bizType = Math.round(message.bizType));
    message.bizId !== undefined && (obj.bizId = message.bizId);
    message.bizData !== undefined && (obj.bizData = message.bizData);
    return obj;
  },

  fromPartial<I extends Exact<DeepPartial<CorpBizDataDto>, I>>(object: I): CorpBizDataDto {
    const message = Object.create(createBaseCorpBizDataDto()) as CorpBizDataDto;
    message.bizType = object.bizType ?? 0;
    message.bizId = object.bizId ?? "";
    message.bizData = object.bizData ?? "";
    return message;
  },
};

/** dingtalk-server grpc api */
export interface DingTalkService {
  getDeptUserList(request: DeptUserListRo, metadata?: Metadata): Observable<RequestIdResult>;
  getDepartmentSubIdList(request: DepartmentSubIdRo, metadata?: Metadata): Observable<RequestIdResult>;
  getUserDetailByUserId(request: UserDetailRo, metadata?: Metadata): Observable<RequestIdResult>;
  getSocialTenantStatus(request: GetSocialTenantStatusRo, metadata?: Metadata): Observable<boolean | undefined>;
  getUserInfoByCode(request: GetUserInfoByCodeRo, metadata?: Metadata): Observable<RequestIdResult>;
  getSsoUserInfoByCode(request: GetSsoUserInfoByCodeRo, metadata?: Metadata): Observable<DingTalkSsoUserInfoResult>;
  sendMessageToUserByTemplateId(
    request: SendMessageToUserByTemplateIdRo,
    metadata?: Metadata,
  ): Observable<AsyncSendMessageResult>;
  uploadMedia(request: UploadMediaRo, metadata?: Metadata): Observable<string | undefined>;
  createMicroApaasApp(request: CreateMicroApaasAppRo, metadata?: Metadata): Observable<CreateMicroApaasAppResult>;
  getSocialTenantInfo(request: GetSocialTenantStatusRo, metadata?: Metadata): Observable<TenantInfoResult>;
  getInternalSkuPage(request: GetInternalSkuPageRo, metadata?: Metadata): Observable<string | undefined>;
  internalOrderFinish(request: InternalOrderFinishRo, metadata?: Metadata): Observable<boolean | undefined>;
  getInternalOrder(request: GetInternalOrderRo, metadata?: Metadata): Observable<RequestIdResult>;
  getDdConfigSign(request: GetDdConfigSignRo, metadata?: Metadata): Observable<string | undefined>;
  getUserCount(request: GetUserCountRo, metadata?: Metadata): Observable<number | undefined>;
  getUserIdListByDeptId(request: GetUserIdListByDeptIdRo, metadata?: Metadata): Observable<RequestIdResult>;
  getUerTreeList(request: GetUserTreeListRo, metadata?: Metadata): Observable<UserTreeListResult>;
  getCorpBizData(request: GetCorpBizDataRo, metadata?: Metadata): Observable<CorpBizDataResult>;
}

declare var self: any | undefined;
declare var window: any | undefined;
declare var global: any | undefined;
var globalThis: any = (() => {
  if (typeof globalThis !== "undefined") {
    return globalThis;
  }
  if (typeof self !== "undefined") {
    return self;
  }
  if (typeof window !== "undefined") {
    return window;
  }
  if (typeof global !== "undefined") {
    return global;
  }
  throw "Unable to locate global object";
})();

function bytesFromBase64(b64: string): Uint8Array {
  if (globalThis.Buffer) {
    return Uint8Array.from(globalThis.Buffer.from(b64, "base64"));
  } else {
    const bin = globalThis.atob(b64);
    const arr = new Uint8Array(bin.length);
    for (let i = 0; i < bin.length; ++i) {
      arr[i] = bin.charCodeAt(i);
    }
    return arr;
  }
}

function base64FromBytes(arr: Uint8Array): string {
  if (globalThis.Buffer) {
    return globalThis.Buffer.from(arr).toString("base64");
  } else {
    const bin: string[] = [];
    arr.forEach((byte) => {
      bin.push(String.fromCharCode(byte));
    });
    return globalThis.btoa(bin.join(""));
  }
}

type Builtin = Date | Function | Uint8Array | string | number | boolean | undefined;

export type DeepPartial<T> = T extends Builtin ? T
  : T extends Array<infer U> ? Array<DeepPartial<U>> : T extends ReadonlyArray<infer U> ? ReadonlyArray<DeepPartial<U>>
  : T extends {} ? { [K in keyof T]?: DeepPartial<T[K]> }
  : Partial<T>;

type KeysOfUnion<T> = T extends T ? keyof T : never;
export type Exact<P, I extends P> = P extends Builtin ? P
  : P & { [K in keyof P]: Exact<P[K], I[K]> } & { [K in Exclude<keyof I, KeysOfUnion<P>>]: never };

function isObject(value: any): boolean {
  return typeof value === "object" && value !== null;
}

function isSet(value: any): boolean {
  return value !== null && value !== undefined;
}
