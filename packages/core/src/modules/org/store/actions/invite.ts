import { IInviteEmailInfo, ITeamTreeNode, IInviteLink, IInviteLinkInfo } from '../../../../exports/store/interfaces';
import * as actions from '../../../shared/store/action_constants';
import { Api } from '../../../../exports/api';

export function updateErrCode(code: number | null) {
  return {
    type: actions.UPDATE_INVITE_ERR_CODE,
    payload: code,
  };
}

/**
 * invite by email
 * @param info 
 * @returns 
 */
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
  return async (dispatch: any) => {
    const { data } = await Api.inviteEmailVerify(token);
    dispatch(updateInviteEmailInfo(data));
    if (!data.success) {
      dispatch(updateErrCode(data.code));
    }
  };
};

/**
 * invite by link - inviter
 * @param childrenTree 
 * @returns 
 */
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
  return async (dispatch: any) => {
    const subTree = await Api.getSubTeams(teamId);
    dispatch(updateSubTeamTreeInvite(teamId, subTree.data.data));
  };
};

// TODO: to be delete by yudongdong
export const getLinkInviteList = (): any => {
  return async (dispatch: any) => {
    const { data: { success, data }} = await Api.getLinkList();
    if (success) {
      dispatch(updateLinkInviteList(data));
    }
  };
};

/**
 * invite by link - invitee(be invited)
 * @param data 
 * @returns 
 */
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
  return async (dispatch: any) => {
    const { data } = await Api.linkValid(token);
    dispatch(updateInviteLinkInfo(data));
  };
};
