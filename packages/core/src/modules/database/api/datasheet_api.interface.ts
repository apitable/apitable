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

import { IFieldPermissionMap, IRoleMember, IViewProperty } from '../../../exports/store';
import { MemberType } from 'types';
import { ITeamData } from '../../../exports/store';

export interface IFieldPermissionRoleListData {
  enabled: boolean;
  members: IFieldPermissionMember[];
  roles: IFieldPermissionRole[],
  setting: {
    formSheetAccessible: boolean
  }
}

export type IFieldPermissionMember = IRoleMember & { isAdmin: boolean };

export type IFieldPermissionAdmin = IFieldPermissionRole;

export interface IFieldPermissionRole {
  avatar: string;
  canEdit: boolean;
  canRead: boolean;
  canRemove: boolean;
  memberCount: number;
  nodeManageable: boolean;
  permissionExtend: boolean;
  role: string;
  roleInvalid: boolean;
  teams: string;
  unitId: string;
  unitType: MemberType;
  unitName: string;
  isAdmin: boolean;
  isOwner: boolean;
  teamData?: ITeamData[];
  unitRefId?: string;
}

export interface IFieldPermissionResponse {
  datasheetId: string;
  fieldPermissionMap: IFieldPermissionMap
}

export interface IFixupDstViewDataPack {
  view: IViewProperty;
  version: number
}

export interface IGetCommentsByIdsResponse {
  [commentId: string]: any
}

export interface ISubOrUnsubByRecordIdsReq {
  datasheetId: string;
  mirrorId?: string;
  recordIds: string[];
}
