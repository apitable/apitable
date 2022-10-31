import { IMeta, ILocalChangeset, IRecordCellValue, IRecordMeta, ResourceType } from '@apitable/core';
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import { IAuthHeader, NodePermission } from '../../../shared/interfaces';

/**
 * Maximum revision difference with which the client changes can be merged with the server's.
 */
export const MAX_REVISION_DIFF = 100;

// effect key names for effect collector
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
 * Datasheet source data
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
 * Channel message
 */
export interface IRoomChannelMessage {
  roomId: string;
  shareId?: string;
  sourceDatasheetId?: string;
  sourceType?: SourceTypeEnum;
  changesets: ILocalChangeset[];
  allowAllEntrance?: boolean;
  /** No auth for Java internal request */
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
