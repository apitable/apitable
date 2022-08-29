import * as actions from '../action_constants';
// 页面总接口
export interface IInvite {
  inviteEmailInfo: IInviteEmailInfo | null;
  teamTreeInvite: ITeamTreeNode[];
  linkList: IInviteLink[];
  inviteLinkInfo: IInviteLinkInfo | null;
  linkToken: string;
  mailToken: string;
  errCode: number | null;
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
// 数据接口
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
