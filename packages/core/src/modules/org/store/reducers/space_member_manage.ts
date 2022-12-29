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

import { produce } from 'immer';
import {
  ISelectedTeamKeysAction, ISelectedTeamRowsAction, ISpaceMemberManage, IUpdateInviteStatusAction, IUpdateMemberInfoInSpaceAction,
  IUpdateMemberListInSpaceAction, IUpdateRightClickTeamInfoInSpaceAction, IUpdateSelectedRowsInSpaceAction, IUpdateSelectedTeamInfoInSpaceAction,
  IUpdateSelectMemberListInSpaceAction, IUpdateSubTeamListInSpaceAction, IUpdateTeamListInSpaceAction,
} from '../../../../exports/store/interfaces';
import * as actions from '../../../shared/store/action_constants';

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
}, defaultState);
