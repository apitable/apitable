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
import { ITeamTreeNode } from './invite';

export interface IUpdateTeamListAction {
  type: typeof actions.UPDATE_TEAM_LIST;
  payload: ITeamTreeNode[];
}
export interface IUpdateMemberListAction {
  type: typeof actions.UPDATE_MEMBER_LIST;
  payload: IMemberInfoInAddressList[];
}

export interface IUpdateSelectedTeamInfoAction {
  type: typeof actions.UPDATE_SELECTED_TEAM_INFO;
  payload: ISelectedTeamInfo;
}

export interface IUpdateMemberInfoAction {
  type: typeof actions.UPDATE_MEMBER_INFO;
  payload: Partial<IMemberInfoInAddressList>;
}

export interface IUpdateSingleMemberInMemberListAction {
  type: typeof actions.UPDATE_SINGLE_MEMBER_IN_MEMBERLIST;
  payload: Partial<IMemberInfoInAddressList>;
}

export interface IUpdateAddressTreeAction {
  type: typeof actions.UPDATE_ADDRESS_TREE;
  payload: {parentId: string, childrenTree: ITeamTreeNode[]};
}

export interface IUpdateMemberListPageNoAction { 
  type: typeof actions.UPDATE_MEMBER_LIST_PAGE_NO;
  payload: number;
}

export interface IUpdateMemberListTotalAction {
  type: typeof actions.UPDATE_MEMBER_LIST_TOTAL;
  payload: number;
}

export interface IUpdateMemberListLodingAction {
  type: typeof actions.UPDATE_MEMBER_LIST_LOADING;
  payload: boolean;
}

export interface IUpdateMemberListPageAction { 
  type: typeof actions.UPDATE_MEMBER_LIST_PAGE;
  payload: IMemberInfoInAddressList[];
}

export interface ITeamData {
  teamId: string;
  fullHierarchyTeamName?: string;
}

/**
 * member info
 */
export interface IMemberInfoInAddressList {
  memberId: string;
  email: string;
  mobile?: string;
  memberName?: string;
  isMemberNameModified?: boolean;
  jobNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  operate?: string;
  position?: string;
  isAdmin?: boolean;
  isMainAdmin?: boolean;
  avatar?: string;
  avatarColor?: number;
  nickName?: string;
  isActive?: string;
  teamData?: ITeamData[];
  isPrimary?: boolean;
  isSubAdmin?: boolean;
  role?: string;
}

export interface IAddressList {
  teamList: ITeamTreeNode[] | [];
  memberList: IMemberInfoInAddressList[];
  selectedTeamInfo: ISelectedTeamInfo;
  memberInfo: IMemberInfoInAddressList;
  memberListPageNo: number;
  memberListTotal: number;
  memberListLoading: boolean;
}

export interface ISelectedTeamInfo {
  teamTitle: string;
  memberCount?: number;
  teamId: string;
}
/**
 * search result - team
 */
export interface ITeamsInSearch {
  teamId: string;
  teamName: string;
  parentName: string;
  shortName: string;
  originName: string;
}
/**
 * search result - member
 */
export interface IMembersInSearch {
  memberId: string;
  memberName: string;
  avatar: string;
  team: string;
  originName: string;
  teamData: ITeamData[];
  isMemberNameModified?: boolean;
}
