import {
  ISpaceMemberManage,
  IUpdateTeamListInSpaceAction,
  IUpdateMemberListInSpaceAction,
  IUpdateSelectedTeamInfoInSpaceAction,
  IUpdateMemberInfoInSpaceAction,
  IUpdateSelectMemberListInSpaceAction,
  IUpdateSubTeamListInSpaceAction,
  IUpdateRightClickTeamInfoInSpaceAction,
  IUpdateInviteStatusAction,
  ISelectedTeamKeysAction,
  ISelectedTeamRowsAction,
  IUpdateSelectedRowsInSpaceAction,
} from '../../../../store/interfaces';
import * as actions from '../../../shared/store/action_constants';
import { produce } from 'immer';

const defaultState: ISpaceMemberManage = {
  // selected teams
  selectedTeamInfoInSpace: {
    teamTitle: '',
    teamId: '0',
  },
  // members list
  memberListInSpace: [],
  memberInfoInSpace: {
    memberId: '',
    email: '',
  },
  selectedRows: [],
  selectMemberListInSpace: [],
  rightClickTeamInfoInSpace: {
    teamTitle: '',
    teamId: '',
  },
  subTeamListInSpace: [],
  teamListInSpace: [],
  isInvited: false,
  selectedTeamKeys: [],
  selectedTeamRows: [],
};
type SpaceMemberManageActions = IUpdateTeamListInSpaceAction |
  IUpdateMemberListInSpaceAction | IUpdateSelectedTeamInfoInSpaceAction | IUpdateMemberInfoInSpaceAction |
  IUpdateSelectMemberListInSpaceAction | IUpdateSubTeamListInSpaceAction | IUpdateRightClickTeamInfoInSpaceAction |
  IUpdateTeamListInSpaceAction | IUpdateInviteStatusAction |
  ISelectedTeamKeysAction | ISelectedTeamRowsAction | IUpdateSelectedRowsInSpaceAction;

export const spaceMemberManage = produce((
  storeData: ISpaceMemberManage = defaultState,
  action: SpaceMemberManageActions,
) => {
  switch (action.type) {
    case actions.UPDATE_MEMBER_LIST_IN_SPACE: {
      storeData.memberListInSpace = action.payload;
      return storeData;
    }
    case actions.UPDATE_SELECTED_TEAM_INFO_IN_SPACE: {
      storeData.selectedTeamInfoInSpace = action.payload;
      return storeData;
    }
    case actions.UPDATE_RIGHT_CLICK_TEAM_INFO_IN_SPACE: {
      storeData.rightClickTeamInfoInSpace = action.payload;
      return storeData;
    }
    case actions.UPDATE_MEMBER_INFO_IN_SPACE: {
      storeData.memberInfoInSpace = action.payload;
      return storeData;
    }
    case actions.UPDATE_SELECT_MEMBER_LIST_IN_SPACE: {
      storeData.selectMemberListInSpace = action.payload;
      return storeData;
    }
    case actions.UPDATE_SELECTED_ROWS_IN_SPACE: {
      storeData.selectedRows = action.payload;
      return storeData;
    }
    case actions.UPDATE_SUB_TEAM_LIST_IN_SPACE: {
      storeData.subTeamListInSpace = action.payload;
      return storeData;
    }
    case actions.UPDATE_TEAM_LIST_IN_SPACE: {
      storeData.teamListInSpace = action.payload;
      return storeData;
    }
    case actions.UPDATE_INVITED_STATUS: {
      storeData.isInvited = action.payload;
      return storeData;
    }
    case actions.UPDATE_SELECTED_TEAM_KEYS: {
      storeData.selectedTeamKeys = action.payload;
      return storeData;
    }
    case actions.UPDATE_SELECTED_TEAM_ROWS: {
      storeData.selectedTeamRows = action.payload;
      return storeData;
    }
    default:
      return storeData;
  }
});
