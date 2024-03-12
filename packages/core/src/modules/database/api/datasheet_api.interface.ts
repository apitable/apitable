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

import { IFieldPermissionMap, IRoleMember, IViewProperty } from '../../../exports/store/interfaces';
import { MemberType } from 'types';
import { ITeamData } from '../../../exports/store/interfaces';

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

export interface IGetTreeSelectDataReq {
  spaceId: string;
  datasheetId: string;
  linkedViewId: string;
  linkedFieldIds: string[];
}

export interface ICascaderNode {
  linkedFieldId: string;
  linkedRecordId: string;
  text: string;
  children?: ICascaderNode[]
}

export interface ILinkedField {
  id: string;
  name: string;
  type: number;
}

export interface IGetTreeSelectDataRes {
  data?: {
    linkedFields: ILinkedField[];
    treeSelects: ICascaderNode[];
  }
}

export interface IGetTreeSelectSnapshotReq {
  datasheetId: string;
  fieldId: string;
  linkedFieldIds: string[];
}

export interface IGetTreeSelectSnapshotRes {
  treeSelectNodes: ICascaderNode[];
}

export interface IUpdateTreeSelectSnapshotReq {
  spaceId: string;
  datasheetId: string;
  fieldId: string;
  linkedDatasheetId: string;
  linkedViewId: string;
}

export interface ITablebundleUserInfo {
  id: string;
  uuid: string;
  avatar: string | null;
  nikeName: string;
  isSocialNameModified: number;
  color: number | null;
}

export interface IDatasheetTablebundles {
  id: string;
  tbdId: string;
  name: string;
  spaceId: string
  dstId: string;
  statusCode: number;
  createdAt: string;
  deletedAt: string;
  createdBy: string;
  expiredAt: string;
  creatorInfo: ITablebundleUserInfo;
  deleteInfo?: ITablebundleUserInfo;
  isDeleted: boolean;
  deletedBy?: string;
  type: number;
}

export interface IRecoverDatasheetTablebundles {
  dstId: string;
  nodeName: string;
  spaceId: string;
  parentId: string;
}

