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
  IInvite, ITeamTreeNode, IUpdateErrCodeAction, IUpdateInviteEmailInfoAction, IUpdateInviteLinkInfoAction, IUpdateLinkListAction,
  IUpdateLinkTokenAction, IUpdateMailTokenAction, IUpdateSubTeamTreeInviteAction, IUpdateTeamTreeInviteAction,
} from '../../../../exports/store/interfaces';
import * as actions from '../../../shared/store/action_constants';

const defaultState: IInvite = {
  inviteEmailInfo: null,
  teamTreeInvite: [],
  linkList: [], // invite links that created
  inviteLinkInfo: null,
  linkToken: '',
  mailToken: '',
  errCode: null,
};

type IInviteActions = IUpdateInviteEmailInfoAction | IUpdateTeamTreeInviteAction |
  IUpdateSubTeamTreeInviteAction | IUpdateLinkListAction | IUpdateInviteLinkInfoAction | IUpdateLinkTokenAction |
  IUpdateMailTokenAction | IUpdateErrCodeAction;

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
const reUpdateTeamTree = (originTree: ITeamTreeNode[], parentId: string, childrenTree: ITeamTreeNode[]) => {
  const parent = findParent(originTree, parentId);
  if (!parent) {
    return;
  }
  parent.children = childrenTree;
};

export const invite = produce((data: IInvite = defaultState, action: IInviteActions) => {
  switch (action.type) {
    case actions.UPDATE_INVITE_EMAIL_INFO: {
      data.inviteEmailInfo = action.payload;
      return data;
    }
    case actions.UPDATE_TEAM_TREE_INVITE: {
      data.teamTreeInvite = action.payload;
      return data;
    }
    case actions.UPDATE_SUB_TEAM_TREE_INVITE: {
      const { parentId, childrenTree } = action.payload;
      reUpdateTeamTree(data.teamTreeInvite, parentId, childrenTree);
      return data;
    }
    case actions.UPDATE_LINK_LIST: {
      data.linkList = action.payload;
      return data;
    }
    case actions.UPDATE_INVITE_LINK_INFO: {
      data.inviteLinkInfo = action.payload;
      return data;
    }
    case actions.UPDATE_LINK_TOKEN: {
      data.linkToken = action.payload;
      return data;
    }
    case actions.UPDATE_MAIL_TOKEN: {
      data.mailToken = action.payload;
      return data;
    }
    case actions.UPDATE_INVITE_ERR_CODE: {
      data.errCode = action.payload;
      return data;
    }
    default:
      return data;
  }
}, defaultState);
