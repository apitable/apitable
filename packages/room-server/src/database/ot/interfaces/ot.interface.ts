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

import { IMeta, ILocalChangeset, IRecordCellValue, IRecordMeta, ResourceType } from '@apitable/core';
import { SourceTypeEnum } from 'shared/enums/changeset.source.type.enum';
import { IAuthHeader, NodePermission } from '../../../shared/interfaces';

/**
 * Maximum revision difference with which the client changes can be merged with the server's.
 */
export const MAX_REVISION_DIFF = parseInt(process.env.MAX_REVISION_DIFF || '100', 10);

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
