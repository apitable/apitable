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
import { isEmpty } from 'lodash';
import {
  IAddressList, IMemberInfoInAddressList, IUpdateMemberInfoAction, IUpdateMemberListAction, IUpdateSelectedTeamInfoAction,
  IUpdateSingleMemberInMemberListAction, IUpdateTeamListAction, IUpdateAddressTreeAction, ITeamTreeNode, IUpdateMemberListPageNoAction,
  IUpdateMemberListTotalAction, IUpdateMemberListLodingAction, IUpdateMemberListPageAction,
} from '../../../../exports/store/interfaces';
import * as actions from '../../../shared/store/action_constants';

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
  memberListPageNo: 1,
  memberListTotal: 0,
  memberListLoading: false,
};
type IAddressListActions = IUpdateTeamListAction |
  IUpdateMemberListAction | IUpdateMemberListPageAction |
  IUpdateSelectedTeamInfoAction |
  IUpdateMemberInfoAction | IUpdateSingleMemberInMemberListAction | IUpdateAddressTreeAction |
  IUpdateMemberListPageNoAction | IUpdateMemberListTotalAction | IUpdateMemberListLodingAction;
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

const findParent = (data: ITeamTreeNode[], id: string): null | ITeamTreeNode => {
  return data.reduce<ITeamTreeNode | null>((preValue, item) => {
    if (preValue) {
      return preValue;
    }
    if (item.teamId === id) {
      return item;
    }
    if (item.children) {
      return findParent(item.children, id);
    }
    return null;
  }, null);
};

const getReplacedTeamList = (oldTeamList: ITeamTreeNode[], newTeamList: ITeamTreeNode[]) => {

  const parentChildrenMap = oldTeamList.reduce((acc, item) => {
    acc.set(item.teamId, item.children);
    return acc;
  }, new Map());
  return newTeamList.map(item => {
    return {
      ...item,
      children: parentChildrenMap.get(item.teamId) || []
    };
  });

};

const updateTeamTree = (originTree: ITeamTreeNode[], parentId: string, childrenTree: ITeamTreeNode[]) => {
  const parent = findParent(originTree, parentId);
  if (!parent) {
    return;
  }
  parent.hasChildren = !isEmpty(childrenTree);
  if(!parent.children || parent.children.length === 0) {
    parent.children = childrenTree;
  } else {
    parent.children = getReplacedTeamList(parent.children, childrenTree);
  }
};

export const addressList = produce((data: IAddressList = defaultState, action: IAddressListActions) => {
  switch (action.type) {
    case actions.UPDATE_TEAM_LIST: {
      data.teamList = action.payload;
      return data;
    }
    case actions.UPDATE_MEMBER_LIST_PAGE: {
      if(data.memberListPageNo > 0) {
        const memberList = [...data.memberList, ...action.payload];
        data.memberList = memberList;
        return data;
      }
      data.memberList = action.payload;
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
    case actions.UPDATE_ADDRESS_TREE: {
      const { parentId, childrenTree } = action.payload;
      updateTeamTree(data.teamList, parentId, childrenTree);
      return data;
    }
    case actions.UPDATE_MEMBER_LIST_TOTAL: {
      data.memberListTotal = action.payload;
      return data;
    }
    case actions.UPDATE_MEMBER_LIST_PAGE_NO: { 
      data.memberListPageNo = action.payload;
      return data;
    }
    case actions.UPDATE_MEMBER_LIST_LOADING: { 
      data.memberListLoading = action.payload;
      return;
    }
    default:
      return data;
  }
}, defaultState);
