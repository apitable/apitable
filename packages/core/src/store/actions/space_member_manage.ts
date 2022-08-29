import {
  IUserInfo,
  ISelectedTeamInfoInSpace,
  IMemberInfoInSpace,
  ISubTeamListInSpaceBase,
  ITeamListInSpace,
  IInviteMemberList,
} from '../interface';
import { Api } from 'api';
import * as actions from '../action_constants';
import { ConfigConstant } from '../../config';
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
 * 空间站-部门列表
 * 查询指定空间的部门列表
 */
export function getTeamListDataInSpace(spaceId: string, user: IUserInfo) {
  let teamListInSpace: ITeamListInSpace[] = [];
  return dispatch => {
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
 * 空间站-部门列表
 * 查询部门信息
 */
export function getTeamInfo(spaceId: string, teamId: string) {
  return dispatch => {
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
 * 空间站-邮件邀请外部成员
 * 邮件邀请成员
 */
export function sendInviteEmail(spaceId: string, invite: IInviteMemberList[]) {
  return dispatch => {
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
 * 空间站-通讯录管理-成员管理
 * 分页查询指定部门的成员列表
 */
export function getMemberListDataInSpace(pageNo: number, teamId?: string) {
  const pageObjectParams = {
    pageSize: ConfigConstant.MEMBER_LIST_PAGE_SIZE,
    order: 'createdAt',
    sort: ConfigConstant.SORT_ASC,
  };
  return dispatch => {
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
 * 空间站-通讯录管理-成员管理
 * 获取成员详情
 */
export function getEditMemberInfo(memberId: string) {
  return dispatch => {
    Api.getMemberInfo({ memberId }).then(res => {
      if (res.data.success) {
        dispatch(updateMemberInfoInSpace(res.data.data));
      }
    });
  };
}

/**
 * 空间站-部门列表
 * 查询直属子部门列表
 */
export function getSubTeamListDataInSpace(teamId: string) {
  return dispatch => {
    Api.getSubTeams(teamId).then(res => {
      const { success, data } = res.data;
      if (success) {
        dispatch(updateSubTeamListInSpace(data));
      }
    });
  };
}

