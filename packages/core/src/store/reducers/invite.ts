import { IInvite, IUpdateInviteEmailInfoAction, IUpdateTeamTreeInviteAction,
  IUpdateSubTeamTreeInviteAction, ITeamTreeNode, IUpdateLinkListAction, IUpdateInviteLinkInfoAction,
  IUpdateLinkTokenAction, IUpdateMailTokenAction, IUpdateErrCodeAction,
} from '../interface';
import * as actions from '../action_constants';
import { produce } from 'immer';
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
});
