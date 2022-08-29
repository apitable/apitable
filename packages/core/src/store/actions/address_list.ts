import { ITeamList, ISelectedTeamInfo, IMemberInfoInAddressList, IUserInfo } from '../interface';
import { Api } from 'api';
import * as actions from '../action_constants';

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
 * 通讯录-部门列表
 */
export function getTeamListData(user: IUserInfo) {
  let teamList: ITeamList[] = [];
  return dispatch => {
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
 * 通讯录-查询指定部门的成员列表
 */
export function getMemberListData(teamId?: string) {
  return dispatch => {
    Api.getMemberList(teamId).then(res => {
      const { success, data } = res.data;
      if (success) {
        dispatch(updateMemberList(data));
      }
    });
  };
}

/**
 * 通讯录-获取成员详情
 */
export function getMemberInfoData(memberId: string) {
  return dispatch => {
    Api.getMemberInfo({ memberId }).then(res => {
      const { success, data } = res.data;
      if (success) {
        dispatch(updateMemberInfo(data));
      }
    });
  };
}
