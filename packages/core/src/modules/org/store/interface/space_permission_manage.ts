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

import * as actions from '../../../shared/store/action_constants';

export interface ISpacePermissionManage {
  subAdminListData: ISubAdminListData | null;
  mainAdminInfo: IMainAdminInfo | null;
  spaceResource: ISpaceResource | null;
}

// action
export interface IUpdateSubAdminListDataAction {
  type: typeof actions.UPDATE_SUB_ADMIN_LIST_DATA;
  payload: ISubAdminListData;
}

export interface IUpdateMainAdminInfoAction {
  type: typeof actions.UPDATE_MAIN_ADMIN_INFO;
  payload: IMainAdminInfo;
}

export interface IUpdateSpaceResourceAction {
  type: typeof actions.UPDATE_SPACE_RESOURCE;
  payload: ISpaceResource;
}

export interface ISubAdminListData {
  firstPage: boolean;
  lastPage: boolean;
  records: ISubAdminList[];
  hasNextPage: boolean;
  pageNum: number;
  pageSize: number;
  size: number;
  total: number;
  pages: number;
  startRow: number;
  enRow: number;
  prePage: number;
  nextPage: number;
  hasPreviousPage: boolean;
}

export interface ISubAdminList {
  id: string;
  memberId: string;
  avatar: string;
  avatarColor: number | null;
  nickName: string;
  memberName: string;
  position: string;
  jobNumber: string;
  mobile: string;
  email: string;
  resourceGroupCodes: string[];
  createdAt: string;
  team: string;
  isActive: boolean;
  isMemberNameModified?: boolean;
}

export interface ISearchMemberData {
  memberId: string;
  memberName: string;
  avatar: string;
  team: string;
  isActive: boolean;
  mobile: string;
  isManager: boolean;
  originName: string;
  isMemberNameModified?: boolean;
}

export interface IPermissionGroup {
  groupName: string;
  resources: IPermissionResource[];
}

export interface IPermissionResource {
  code: string;
  name: string;
  desc: string;
}

export interface IMainAdminInfo {
  name: string;
  avatar: string;
  avatarColor: number | null;
  nickName: string;
  position: string;
  areaCode: string;
  mobile: string;
  email: string;
  isMemberNameModified?: boolean;
}

export interface ISpaceResource {
  spaceName: string;
  mainAdmin: boolean;
  menuTree: IMenuTree[];
  permissions: string[];
}

export interface IMenuTree {
  menuCode: string;
  menuName: string;
  sequence?: number;
  parentCode?: string;
  operators: string[];
  children?: IMenuTree[];
}

