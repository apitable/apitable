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

import {
  IBaseDatasheetPack,
  IFieldPermissionMap,
  IGetRecords,
  IOperation,
  IRecord,
  IRecordMap,
  IRemoteChangeset,
  IServerDatasheetPack,
  ISnapshot,
  IUnitValue,
  IUserValue,
  IViewPack,
  IViewProperty,
  ResourceType,
} from '@apitable/core';
import { NodeInfo } from './node.model';
import { INamedUser } from '../../../shared/interfaces';

export class ChangesetView implements IRemoteChangeset {
  userId!: string;
  spaceId!: string;
  messageId!: string;
  revision!: number;
  resourceId!: string;
  resourceType!: ResourceType;
  operations!: IOperation[];
  createdAt!: number;
}

export class RecordsMapView implements IGetRecords {
  revision!: number;
  recordMap?: IRecordMap;
}

export class UnitInfo implements IUnitValue {
  unitId!: string;
  type!: number;
  name!: string;
  uuid?: string;
  userId?: string;
  avatar?: string;
  isActive?: boolean;
  isDeleted?: boolean;
  nickName?: string;
  avatarColor?: number;
}

export class UserInfo implements IUserValue {
  uuid!: string;
  userId!: string;
  name!: string;
  avatar?: string;
  nickName?: string;
  avatarColor?: number;
}

export class FieldPermissionMap {
  fieldPermissionMap?: IFieldPermissionMap;
}

export class DatasheetPack extends FieldPermissionMap implements IServerDatasheetPack {
  snapshot!: ISnapshot;
  datasheet!: NodeInfo;
  foreignDatasheetMap?: { [foreignDatasheetId: string]: IBaseDatasheetPack };
  units?: (UserInfo | UnitInfo)[];
}

export class ViewPack implements IViewPack {
  view!: IViewProperty;
  revision!: number;
}

export class ArchivedRecord {
  record!: IRecord | undefined;
  archivedUser!: INamedUser | undefined;
  archivedAt!: number;
}