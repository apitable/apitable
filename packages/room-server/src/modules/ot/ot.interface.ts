import { IMeta, ILocalChangeset, IRecordCellValue, IRecordMeta, ResourceType } from '@vikadata/core';
import { SourceTypeEnum } from 'enums/changeset.source.type.enum';
import { IAuthHeader, NodePermission } from 'interfaces';

// 最大变更版本
export const MAX_REVISION_DIFF = 100;

// 副作用变量收集器中的变量键值
export enum EffectConstantName {
  Meta = 'meta',
  MetaActions = 'metaActions',
  RecordMetaMap = 'recordMetaMap',
  RemoteChangeset = 'remoteChangeset',
  MentionedMessages = 'mentionedMessages',
  AttachCite = 'attachCite',
}

export interface ICommonData {
  userId?: string;
  uuid?: string,
  spaceId: string,
  dstId: string,
  revision: number,
  resourceId: string,
  resourceType: ResourceType,
  permission: NodePermission,
}

export interface IFieldData {
  fieldId: string;
  data: any;
}

export interface IRestoreRecordInfo {
  data: IRecordCellValue,
  recordMeta?: IRecordMeta,
}

/**
 * 数表源数据
 */
export interface IReadMetaData {
  name: string;
  id: string;
  revision: number;
  nodeParentId: string;
  nodeId: string;
  ownerId: string;
  creatorId: string;
  spaceId: string;
  meta: IMeta;
}

/**
 * 通道消息
 * sourceDatasheetId: 源表ID
 * sourceType: 来源的类型
 * shareId: 分享 id
 * roomId: Room id
 */
export interface IRoomChannelMessage {
  roomId: string;
  shareId?: string;
  sourceDatasheetId?: string;
  sourceType?: SourceTypeEnum;
  changesets: ILocalChangeset[];
  allowAllEntrance?: boolean;
  // java 内部调用 不校验权限
  internalAuth?: {
    userId: string,
    uuid: string
  }
}

export interface IChangesetParseResult {
  transaction: any,
  effectMap: Map<string, any>, 
  commonData: ICommonData, 
  resultSet: any,
}

export interface IOtEventContext {
  authHeader: IAuthHeader;
  spaceId: string;
  operatorUserId?: string;
  fromEditableSharedNode: boolean;
}
