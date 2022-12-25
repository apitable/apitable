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

import { ITeamList, ISelectedTeamInfo, IMemberInfoInAddressList, IUserInfo } from '../../../../exports/store/interfaces';
import { Api } from '../../../../exports/api';
import * as actions from '../../../shared/store/action_constants';

export function updateTeamList(teamList: ITeamList[]) {
  return {
    type: actions.UPDATE_TEAM_LIST,
    payload: teamList,
  };
}
export function updateSelectedTeamInfo(info: ISelectedTeamInfo) {
  return {
    type: actions.UPDATE_SELECTED_TEAM_INFO,
    payload: info,
  };
}

export function updateMemberList(memberList: IMemberInfoInAddressList[]) {
  return {
    type: actions.UPDATE_MEMBER_LIST,
    payload: memberList,
  };
}
export function updateMemberInfo(memberInfo: Partial<IMemberInfoInAddressList>) {
  return {
    type: actions.UPDATE_MEMBER_INFO,
    payload: memberInfo,
  };
}
export function updateSingleMemberInMemberList(memberInfo: Partial<IMemberInfoInAddressList>) {
  return {
    type: actions.UPDATE_SINGLE_MEMBER_IN_MEMBERLIST,
    payload: memberInfo,
  };
}

/**
 * Contacts - get Team(Departments) Lists
 */
export function getTeamListData(_user: IUserInfo) {
  let teamList: ITeamList[] = [];
  return (dispatch: any) => {
    Api.getTeamList().then(res => {
      const { success, data } = res.data;
      if (success) {
        teamList = data;
      }
      dispatch(updateTeamList(teamList));

      const firstTeamId = teamList?.[0]?.teamId;
      if (!firstTeamId) return;

      Api.readTeam(firstTeamId).then(res => {
        const { success, data } = res.data;
        success && dispatch(updateSelectedTeamInfo({
          teamTitle: data.teamName,
          memberCount: data.memberCount,
          teamId: data.teamId,
        }));
        dispatch(updateMemberInfo({ memberId: '', email: '' }));
      });
    });
  };
}

/**
 * Contacts - get specified Team(Departments) members list
 */
export function getMemberListData(teamId?: string) {
  return (dispatch: any) => {
    Api.getMemberList(teamId).then(res => {
      const { success, data } = res.data;
      if (success) {
        dispatch(updateMemberList(data));
      }
    });
  };
}

/**
 * Contacts - get specified member detail info
 */
export function getMemberInfoData(memberId: string) {
  return (dispatch: any) => {
    Api.getMemberInfo({ memberId }).then(res => {
      const { success, data } = res.data;
      if (success) {
        dispatch(updateMemberInfo(data));
      }
    });
  };
}
