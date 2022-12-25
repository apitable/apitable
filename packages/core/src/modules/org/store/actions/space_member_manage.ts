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
  IUserInfo,
  ISelectedTeamInfoInSpace,
  IMemberInfoInSpace,
  ISubTeamListInSpaceBase,
  ITeamListInSpace,
  IInviteMemberList,
} from '../../../../exports/store/interfaces';
import { Api } from '../../../../exports/api';
import * as actions from '../../../shared/store/action_constants';
import { ConfigConstant } from '../../../../config';
export function updateMemberListInSpace(memberListInSpace: IMemberInfoInSpace[]) {
  return {
    type: actions.UPDATE_MEMBER_LIST_IN_SPACE,
    payload: memberListInSpace,
  };
}
export function updateSelectedTeamInfoInSpace(info: ISelectedTeamInfoInSpace) {
  return {
    type: actions.UPDATE_SELECTED_TEAM_INFO_IN_SPACE,
    payload: info,
  };
}
export function updateRightClickTeamInfoInSpace(info: ISelectedTeamInfoInSpace) {
  return {
    type: actions.UPDATE_RIGHT_CLICK_TEAM_INFO_IN_SPACE,
    payload: info,
  };
}
export function updateMemberInfoInSpace(memberInfoInSpace: IMemberInfoInSpace) {
  return {
    type: actions.UPDATE_MEMBER_INFO_IN_SPACE,
    payload: memberInfoInSpace,
  };
}
export function updateSelectedRowsInSpace(selectedRows: IMemberInfoInSpace[]) {
  return {
    type: actions.UPDATE_SELECTED_ROWS_IN_SPACE,
    payload: selectedRows,
  };
}
export function updateSelectMemberListInSpace(selectMemberListInSpace: string[]) {
  return {
    type: actions.UPDATE_SELECT_MEMBER_LIST_IN_SPACE,
    payload: selectMemberListInSpace,
  };
}
export function updateSubTeamListInSpace(subTeamListInSpace: ISubTeamListInSpaceBase[]) {
  return {
    type: actions.UPDATE_SUB_TEAM_LIST_IN_SPACE,
    payload: subTeamListInSpace,
  };
}
export function updateTeamListInSpace(teamListOfInvite: ITeamListInSpace[]) {
  return {
    type: actions.UPDATE_TEAM_LIST_IN_SPACE,
    payload: teamListOfInvite,
  };
}
export function updateInviteStatus(isInvited: boolean) {
  return {
    type: actions.UPDATE_INVITED_STATUS,
    payload: isInvited,
  };
}
export function selectedTeamKeysInModal(arr: string[]) {
  return {
    type: actions.UPDATE_SELECTED_TEAM_KEYS,
    payload: arr,
  };
}
export function selecteTeamRowsInModal(arr: ISubTeamListInSpaceBase[]) {
  return {
    type: actions.UPDATE_SELECTED_TEAM_ROWS,
    payload: arr,
  };
}
/**
 * Space - Team List
 * Query and get specific team list
 */
export function getTeamListDataInSpace(_spaceId: string, _user: IUserInfo) {
  let teamListInSpace: ITeamListInSpace[] = [];
  return (dispatch: any) => {
    Api.getTeamList().then(res => {
      const { success, data } = res.data;
      if (success) {
        teamListInSpace = data;
      }
      dispatch(updateTeamListInSpace(teamListInSpace));
    });
  };
}
/**
 * Contacts - Team List
 * Get Team Info
 */
export function getTeamInfo(_spaceId: string, teamId: string) {
  return (dispatch: any) => {
    Api.readTeam(teamId).then(res => {
      const { success, data } = res.data;      
      success && dispatch(updateSelectedTeamInfoInSpace({
        teamTitle: data.teamName,
        memberCount: data.memberCount,
        teamId: data.teamId,
      }));
    });
  };
}
/**
 * Space - invite member by email
 * invite member by email
 */
export function sendInviteEmail(_spaceId: string, invite: IInviteMemberList[]) {
  return (dispatch: any) => {
    Api.sendInvite(invite).then(res => {
      const { success } = res.data;
      dispatch(updateInviteStatus(true));
      if (success) {
        Api.readTeam('0').then(res => {
          const { success, data } = res.data;
          success && dispatch(updateSelectedTeamInfoInSpace({
            teamTitle: data.teamName,
            memberCount: data.memberCount,
            teamId: data.teamId,
          }));
        });
      }
    });
  };
}
/**
 * Space-Contact-Members Management
 * Get members list by specific team with pagination
 */
export function getMemberListDataInSpace(pageNo: number, teamId?: string) {
  const pageObjectParams = {
    pageSize: ConfigConstant.MEMBER_LIST_PAGE_SIZE,
    order: 'createdAt',
    sort: ConfigConstant.SORT_ASC,
  };
  return (dispatch: any) => {
    Api.getMemberListInSpace(JSON.stringify({ ...pageObjectParams, pageNo }), teamId).then(res => {
      const { success, data } = res.data;
      if (success) {
        const memberListInSpace: IMemberInfoInSpace[] = data.records;
        dispatch(updateMemberListInSpace(memberListInSpace));
      }
    });
  };
}

/**
 * Space-Contact-Members Management
 * Get Member detail
 */
export function getEditMemberInfo(memberId: string) {
  return (dispatch: any) => {
    Api.getMemberInfo({ memberId }).then(res => {
      if (res.data.success) {
        dispatch(updateMemberInfoInSpace(res.data.data));
      }
    });
  };
}

/**
 * Space-Team List
 * Get sub team list by specific team
 */
export function getSubTeamListDataInSpace(teamId: string) {
  return (dispatch: any) => {
    Api.getSubTeams(teamId).then(res => {
      const { success, data } = res.data;
      if (success) {
        dispatch(updateSubTeamListInSpace(data));
      }
    });
  };
}

