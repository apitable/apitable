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

import { ISelectedTeamInfo, IMemberInfoInAddressList, IUserInfo, ITeamTreeNode } from 'exports/store/interfaces';
import { Api } from 'exports/api';
import * as actions from '../../../shared/store/action_constants';
import { ConfigConstant } from 'config';

export function updateTeamList(teamList: ITeamTreeNode[]) {
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

export function updateMemberListPage(memberList: IMemberInfoInAddressList[]) {
  return {
    type: actions.UPDATE_MEMBER_LIST_PAGE,
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

export function updateAddressTree(parentId: string | number, childrenTree: ITeamTreeNode[]) {
  return {
    type: actions.UPDATE_ADDRESS_TREE,
    payload: { parentId, childrenTree },
  };
}

export function updateMemberListPageNo(pageNo: number) {
  return {
    type: actions.UPDATE_MEMBER_LIST_PAGE_NO,
    payload: pageNo,
  };
}

export function updateMemberListTotal(total: number) {
  return {
    type: actions.UPDATE_MEMBER_LIST_TOTAL,
    payload: total,
  };
}

export function updataMemberListLoading(loading: boolean) {
  return {
    type: actions.UPDATE_MEMBER_LIST_LOADING,
    payload: loading,
  };
}

/**
 * Contacts - get Team(Departments) Lists
 */
export function getTeamListData(_user: IUserInfo) {
  let teamList: ITeamTreeNode[] = [];
  return (dispatch: any) => {
    Api.getTeamListLayered().then(res => {
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
      }, err => {
        console.error('API.readTeam error', err);
      });
    }, err => {
      console.error('API.getTeamListLayered error', err);
    });
  };
}

/**
 * Contacts - get specified Team(Departments) members list
 */
export function getMemberListData(teamId?: string) {
  const pageObjectParams = {
    pageSize: ConfigConstant.MEMBER_LIST_PAGE_SIZE,
    order: ' vom.id',
    sort: ConfigConstant.SORT_ASC,
  };
  return (dispatch: any) => {
    dispatch(updataMemberListLoading(true));

    Api.getMemberListInSpace(JSON.stringify({ ...pageObjectParams, pageNo: 1 }), teamId).then(res => {
      const { success, data } = res.data;
      if (success) {
        const memberListInSpace: IMemberInfoInAddressList[] = data.records;
        const memberTotal = data.total;
        dispatch(updateMemberListTotal(memberTotal));
        dispatch(updateMemberList(memberListInSpace));
        dispatch(updataMemberListLoading(false));
       
      }
    }, err => {
      console.error('API.getMemberListInSpace error', err);
    });
  };
}

export function getMemberListPageData(pageNo: number, teamId?: string) {
  const pageObjectParams = {
    pageSize: ConfigConstant.MEMBER_LIST_PAGE_SIZE,
    order: ' vom.id',
    sort: ConfigConstant.SORT_ASC,
  };
  
  return (dispatch: any) => {
    dispatch(updataMemberListLoading(true));

    Api.getMemberListInSpace(JSON.stringify({ ...pageObjectParams, pageNo }), teamId).then(res => {
      const { success, data } = res.data;
      if (success) {
        const memberListInSpace: IMemberInfoInAddressList[] = data.records;
        const memberTotal = data.total;
        dispatch(updateMemberListTotal(memberTotal));
        dispatch(updateMemberListPage(memberListInSpace));
        dispatch(updataMemberListLoading(false));
      } 
    }, err => {
      console.error('API.getMemberListInSpace error', err);
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
    }, err => {
      console.error('API.getMemberInfo error', err);
    });
  };
}

export const getSubTeam = (teamId: string | number): any => {
  return async(dispatch: any) => {
    const subTree = await Api.getSubTeams(teamId);
    dispatch(updateAddressTree(teamId, subTree.data.data));
  };
};

