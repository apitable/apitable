import * as actions from '../../../shared/store/action_constants';
import { ITeamData } from './address_list';

export interface ISpaceMemberManage {
  memberListInSpace: IMemberInfoInSpace[];
  selectedTeamInfoInSpace: ISelectedTeamInfoInSpace | null;
  memberInfoInSpace: IMemberInfoInSpace;
  selectedRows: IMemberInfoInSpace[];
  selectMemberListInSpace: string[];
  subTeamListInSpace: ISubTeamListInSpaceBase[];
  rightClickTeamInfoInSpace: ISelectedTeamInfoInSpace;
  teamListInSpace: ITeamListInSpace[];
  isInvited: boolean;
  selectedTeamKeys: string[];
  selectedTeamRows: ISubTeamListInSpaceBase[];
}

// action interfaces

export interface IUpdateMemberListInSpaceAction {
  type: typeof actions.UPDATE_MEMBER_LIST_IN_SPACE;
  payload: IMemberInfoInSpace[];
}
export interface IUpdateSelectedTeamInfoInSpaceAction {
  type: typeof actions.UPDATE_SELECTED_TEAM_INFO_IN_SPACE;
  payload: ISelectedTeamInfoInSpace;
}
export interface IUpdateRightClickTeamInfoInSpaceAction {
  type: typeof actions.UPDATE_RIGHT_CLICK_TEAM_INFO_IN_SPACE;
  payload: ISelectedTeamInfoInSpace;
}
export interface IUpdateMemberInfoInSpaceAction {
  type: typeof actions.UPDATE_MEMBER_INFO_IN_SPACE;
  payload: IMemberInfoInSpace;
}
export interface IUpdateSelectedRowsInSpaceAction {
  type: typeof actions.UPDATE_SELECTED_ROWS_IN_SPACE;
  payload: IMemberInfoInSpace[];
}
export interface IUpdateSelectMemberListInSpaceAction {
  type: typeof actions.UPDATE_SELECT_MEMBER_LIST_IN_SPACE;
  payload: string[];
}
export interface IUpdateSubTeamListInSpaceAction {
  type: typeof actions.UPDATE_SUB_TEAM_LIST_IN_SPACE;
  payload: ISubTeamListInSpaceBase[];
}
export interface IUpdateTeamListInSpaceAction {
  type: typeof actions.UPDATE_TEAM_LIST_IN_SPACE;
  payload: ITeamListInSpace[];
}
export interface IUpdateInviteStatusAction {
  type: typeof actions.UPDATE_INVITED_STATUS;
  payload: boolean;
}
export interface ISelectedTeamKeysAction {
  type: typeof actions.UPDATE_SELECTED_TEAM_KEYS;
  payload: string[];
}
export interface ISelectedTeamRowsAction {
  type: typeof actions.UPDATE_SELECTED_TEAM_ROWS;
  payload: ISubTeamListInSpaceBase[];
}

// data interfaces
// member info, new invited members only has=ve `memberId` and `email`
export interface IMemberInfoInSpace {
  memberId: string;
  email: string;
  teamIds?: string;
  mobile?: string;
  teams?: ITeamsInSpace[];
  memberName?: string;
  isMemberNameModified?: boolean;
  jobNumber?: string;
  createdAt?: string;
  updatedAt?: string;
  operate?: string;
  position?: string;
  avatar?: string;
  isActive?: string;
  tags?: ITagsInSpace[];
  isPrimary?: boolean;
  isSubAdmin?: boolean;
  nickName?: string;
  isNickNameModified?: boolean;
  teamData?: ITeamData[];
}

/**
 * edit(update) member info
 */
export interface IUpdateMemberInfo {
  memberId: string;
  memberName?: string;
  position?: string;
  email?: string;
  jobNumber?: string;
  teamIds?: string[];
  tagIds?: ITagsInSpace[];
}
export interface ITeamListInSpace {
  teamId: string;
  teamName: string;
  parentId?: string;
  memberCount?: number;
  sequence?: number;
  children?: ITeamListInSpace[];
}
export interface ISelectedTeamInfoInSpace {
  teamTitle: string;
  memberCount?: number;
  teamId: string;
  parentId?: string;
}

// data interface - email invitation's target member info
export interface IInviteMemberList {
  email: string;
  teamId: string;
}

export interface ISubTeamListInSpaceBase extends ISearchResult {
  teamId: string;
  teamName: string;
  parentId?: string;
  memberCount?: number;
  sequence?: number;
  hasChildren?: boolean;
}
interface ISearchResult {
  parentName?: string;
  shortName?: string;
}

export interface ITeamsInSpace {
  teamId: string;
  teamName: string;
}
export interface ITagsInSpace {
  tagId: string;
  tagName: string;
}

/**
 * add member
 */
export interface IAddIsActivedMemberInfo {
  id: string;
  type: number;
}
