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
