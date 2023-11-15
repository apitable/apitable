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

import * as actions from '../../../shared/store/action_constants';
export interface IInvite {
  inviteEmailInfo: IInviteEmailInfo | null;
  teamTreeInvite: ITeamTreeNode[];
  linkList: IInviteLink[];
  inviteLinkInfo: IInviteLinkInfo | null;
  linkToken: string;
  inviteLinkData?: string;
  mailToken: string;
  errCode: number | null;
  nodeId?: string;
}

// action
export interface IUpdateInviteEmailInfoAction {
  type: typeof actions.UPDATE_INVITE_EMAIL_INFO;
  payload: IInviteEmailInfo;
}

export interface IUpdateTeamTreeInviteAction {
  type: typeof actions.UPDATE_TEAM_TREE_INVITE;
  payload: ITeamTreeNode[];
}
export interface IUpdateSubTeamTreeInviteAction {
  type: typeof actions.UPDATE_SUB_TEAM_TREE_INVITE;
  payload: {parentId: string, childrenTree: ITeamTreeNode[]};
}
export interface IUpdateLinkListAction {
  type: typeof actions.UPDATE_LINK_LIST;
  payload: IInviteLink[];
}
export interface IUpdateInviteLinkInfoAction {
  type: typeof actions.UPDATE_INVITE_LINK_INFO;
  payload: IInviteLinkInfo | null;
}
export interface IUpdateLinkTokenAction {
  type: typeof actions.UPDATE_LINK_TOKEN;
  payload: string;
}
export interface IUpdateMailTokenAction {
  type: typeof actions.UPDATE_MAIL_TOKEN;
  payload: string;
}
export interface IUpdateErrCodeAction {
  type: typeof actions.UPDATE_INVITE_ERR_CODE;
  payload: number | null;
}

// data interfaces start
export interface IInviteEmailInfo {
  success: boolean;
  data: IInviteEmailInfo;
  message: string;
  code: number;
}
export interface IInviteEmailInfo {
  spaceId: string;
  spaceName: string;
  inviter: string;
  inviteEmail: string;
  isLogin: boolean;
  isBound: boolean;
  inviteCode: string;
}
export interface ITeamTreeNode {
  teamId: string;
  teamName: string;
  parentId: string;
  parentTeamName: string;
  memberCount: number;
  sequence: number;
  hasChildren: boolean;
  children?: ITeamTreeNode[];
}

export interface IInviteLink {
  teamId: string;
  parentTeamName: string;
  teamName: string;
  token: string;
}
export interface ILinkSpaceInfo {
  memberName: string;
  spaceName: string;
  spaceId: string;
  isLogin: boolean;
  isExist: boolean;
  inviteCode: string;
}

export interface IInviteLinkInfo {
  success: boolean;
  code: number;
  message: string;
  data: ILinkSpaceInfo;
}
