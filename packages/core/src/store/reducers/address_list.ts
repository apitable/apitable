import {
  IAddressList,
  IUpdateTeamListAction,
  IUpdateMemberListAction,
  IUpdateSelectedTeamInfoAction,
  IUpdateMemberInfoAction,
  IMemberInfoInAddressList,
  IUpdateSingleMemberInMemberListAction,
} from '../interface';
import * as actions from '../action_constants';
import { produce } from 'immer';
const defaultState: IAddressList = {
  // 部门列表
  teamList: [],
  // 所选中部门
  selectedTeamInfo: {
    teamTitle: '',
    teamId: '',
  },
  // 成员列表
  memberList: [],
  // 成员详情
  memberInfo: {
    memberId: '',
    email: '',
  },
};
type IAddressListActions = IUpdateTeamListAction |
  IUpdateMemberListAction |
  IUpdateSelectedTeamInfoAction |
  IUpdateMemberInfoAction | IUpdateSingleMemberInMemberListAction;
const updateMemberInList = (state: IMemberInfoInAddressList[], payload: Partial<IMemberInfoInAddressList>) => {
  if (!payload.memberId) {
    return state;
  }
  return state.reduce((prev: IMemberInfoInAddressList[], cur: IMemberInfoInAddressList) => {
    if (cur.memberId === payload.memberId) {
      prev.push({ ...cur, ...payload });
      return prev;
    } 
    prev.push({ ...cur });
    return prev;
    
  }, []);
};
export const addressList = produce((data: IAddressList = defaultState, action: IAddressListActions) => {
  switch (action.type) {
    case actions.UPDATE_TEAM_LIST: {
      data.teamList = action.payload;
      return data;
    }
    case actions.UPDATE_MEMBER_LIST: {
      data.memberList = action.payload;
      return data;
    }
    case actions.UPDATE_SELECTED_TEAM_INFO: {
      data.selectedTeamInfo = action.payload;
      return data;
    }
    case actions.UPDATE_MEMBER_INFO: {
      Object.assign(data.memberInfo, action.payload);
      return data;
    }
    case actions.UPDATE_SINGLE_MEMBER_IN_MEMBERLIST: {
      data.memberList = updateMemberInList(data.memberList, action!.payload);
      return data;
    }
    default:
      return data;
  }
});
