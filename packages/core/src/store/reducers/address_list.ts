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
  teamList: [],
  // selected team
  selectedTeamInfo: {
    teamTitle: '',
    teamId: '',
  },
  // member list
  memberList: [],
  // member info
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
