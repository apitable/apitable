import { IInviteEmailInfo, ITeamTreeNode, IInviteLink, IInviteLinkInfo } from '../interface';
import * as actions from '../action_constants';
import { Api } from 'api';
// 公用
export function updateErrCode(code: number | null) {
  return {
    type: actions.UPDATE_INVITE_ERR_CODE,
    payload: code,
  };
}
// 邮箱邀请
export function updateInviteEmailInfo(info: IInviteEmailInfo) {
  return {
    type: actions.UPDATE_INVITE_EMAIL_INFO,
    payload: info,
  };
}
export const updateMailToken = (token: string) => {
  return {
    type: actions.UPDATE_MAIL_TOKEN,
    payload: token,
  };
};
export const getMailLinkData = (token: string): any => {
  return async dispatch => {
    const { data } = await Api.inviteEmailVerify(token);
    dispatch(updateInviteEmailInfo(data));
    if (!data.success) {
      dispatch(updateErrCode(data.code));
    }
  };
};

// 链接邀请 - 邀请者部分
export const updateTeamTreeInvite = (childrenTree: ITeamTreeNode[]) => {
  return {
    type: actions.UPDATE_TEAM_TREE_INVITE,
    payload: childrenTree,
  };
};
export const updateSubTeamTreeInvite = (parentId: string, childrenTree: ITeamTreeNode[]) => {
  return {
    type: actions.UPDATE_SUB_TEAM_TREE_INVITE,
    payload: { parentId, childrenTree },
  };
};
export const updateLinkInviteList = (list: IInviteLink[]) => {
  return {
    type: actions.UPDATE_LINK_LIST,
    payload: list,
  };
};
export const getSubTeamInvite = (teamId: string): any => {
  return async dispatch => {
    const subTree = await Api.getSubTeams(teamId);
    dispatch(updateSubTeamTreeInvite(teamId, subTree.data.data));
  };
};

// TODO: 待删除
export const getLinkInviteList = (): any => {
  return async dispatch => {
    const { data: { success, data }} = await Api.getLinkList();
    if (success) {
      dispatch(updateLinkInviteList(data));
    }
  };
};

// 链接邀请 - 被邀请者部分
export const updateInviteLinkInfo = (data: IInviteLinkInfo | null) => {
  return {
    type: actions.UPDATE_INVITE_LINK_INFO,
    payload: data,
  };
};
export const updateLinkToken = (token: string) => {
  return {
    type: actions.UPDATE_LINK_TOKEN,
    payload: token,
  };
};

export const verifyLink = (token: string): any => {
  return async dispatch => {
    const { data } = await Api.linkValid(token);
    dispatch(updateInviteLinkInfo(data));
  };
};
