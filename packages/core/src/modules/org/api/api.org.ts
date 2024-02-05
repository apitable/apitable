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

import axios from 'axios';
import * as Url from '../../shared/api/url';
import {
  IAddIsActivedMemberInfo, IApiWrapper, IInviteMemberList, IMemberInfoInAddressList, IUpdateMemberInfo
} from '../../../exports/store/interfaces';
import urlcat from 'urlcat';

const CancelToken = axios.CancelToken;

/**
 * Query the list of units(member/group) in the space's organization
 * @returns
 */
export function getUnitsByMember() {
  return axios.get(Url.MEMBER_UNITS);
}

export function getTeamListLayered() {
  return axios.get(Url.TEAM_LIST_LAYERED);
}

/**
 * Get member info
 *
 * @param memberId  Contact member id
 * @param userId   user id
 */
export function getMemberInfo({ memberId, uuid }: { memberId?: string; uuid?: string }) {
  return axios.get<IApiWrapper & { data: IMemberInfoInAddressList }>(Url.MEMBER_INFO, {
    params: {
      memberId,
      uuid,
    },
  });
}

export function getNodeCollaboratorInfo({ uuid, nodeId }: { uuid?: string; nodeId: string }) {
  return axios.get<IApiWrapper & { data: IMemberInfoInAddressList }>(Url.COLLABORATOR_INFO, {
    params: {
      uuid,
      nodeId,
    },
  });
}

/**
 * Get member list by pagination
 *
 * @param pageObjectParams pagination params
 * @param teamId if empty return root team, default 0
 * @param isActive whether the member has joined space
 */
export function getMemberListInSpace(pageObjectParams: string, teamId?: string, isActive?: string) {
  return axios.get(Url.MEMBER_LIST_IN_SPACE, {
    params: {
      pageObjectParams,
      teamId,
      isActive,
    },
  });
}

/**
 * Update Team Info
 * edit the team
 *
 * @param teamId
 * @param superId parent team ID,if empty return root team, default 0
 * @param teamName team name
 */
export function updateTeamInfo(teamId: string, superId: string, teamName?: string) {
  return axios.post(Url.UPDATE_TEAM, {
    teamId,
    teamName,
    superId,
  });
}

/**
 * Create Team
 *
 * @param name
 * @param superId parent team id, if empty return root team, default 0
 */
export function createTeam(name: string, superId: string) {
  return axios.post(Url.CREATE_TEAM, {
    name,
    superId,
  });
}

/**
 * Get Team Info
 *
 * @param teamId
 */
export function readTeam(teamId: string) {
  return axios.get(Url.READ_TEAM, {
    params: {
      teamId,
    },
  });
}

/**
 * Delete the team
 * @param teamId team ID
 */
export function deleteTeam(teamId: string) {
  return axios.delete(`${Url.DELETE_TEAM}${teamId}`);
}

/**
 * Update Member Info
 *
 * @param data member info
 */
export function updateMember(data: IUpdateMemberInfo) {
  return axios.post(Url.UPDATE_MEMBER, data);
}

/**
 * Delete single member
 *
 * @param teamId Team ID
 * @param memberId Member ID
 * @param action Delete Action(0:delete from inner team, 1:delete from organization)
 */
export function singleDeleteMember(teamId: string, memberId: string, isDeepDel: boolean) {
  return axios.delete(Url.SINGLE_DELETE_MEMBER, {
    data: {
      memberId,
      teamId,
      action: isDeepDel ? 1 : 0,
    },
  });
}

/**
 * Batch Delete Members
 *
 * @param memberId Member ID
 * @param teamId Team ID
 * @param action Delete Action(0:delete from inner team, 1:delete from organization)
 */
export function BatchDeleteMember(teamId: string, memberId: string[], isDeepDel: boolean) {
  return axios.delete(Url.BATCH_DELETE_MEMBER, {
    data: {
      memberId,
      teamId,
      action: isDeepDel ? 1 : 0,
    },
  });
}

/**
 * Get Sub Teams
 *
 * @param teamId Team ID
 */
export function getSubTeams(teamId: string | number) {
  return axios.get(Url.READ_SUB_TEAMS, {
    params: {
      teamId,
    },
  });
}

/**
 * Add active units(members,teams) to team
 *
 * @param unitList
 * @param teamId
 */
export function addIsActivedMembersInSpace(unitList: IAddIsActivedMemberInfo[], teamId: string) {
  return axios.post(Url.TEAM_ADD_MEMBER, {
    unitList,
    teamId,
  });
}

/**
 * Get members by team(include members in the sub team)
 */
export function getTeamAndMemberWithoutSub(teamId?: string) {
  return axios.get(Url.TEAM_MEMBERS, {
    params: {
      teamId,
    },
  });
}

/**
 *
 * Search organization resources
 * search in the add department member UI modal
 *
 * @param keyword the keyword to search
 * @param className class style
 */
export function addMemberSearchRes(keyword: string, className: string) {
  return axios.get(Url.GET_ADD_MEMBERS, {
    params: {
      keyword,
      className,
    },
  });
}

/**
 * Search Teams or Members
 *
 * @param keyword the keyword to search
 */
export function searchTeamAndMember(keyword: string) {
  return axios.get(Url.SEARCH_TEAM_MEMBER, {
    params: {
      keyword,
      className: 'highLight',
    },
  });
}

/**
 * Update Member's Team
 * @param memberIds
 * @param preTeamId Original Team ID, required
 * @param newTeamIds New Team IDs list
 */
export function updateMemberTeam(memberIds: string[], newTeamIds: string[], preTeamId?: string) {
  return axios.post(Url.UPDATE_MEMBER_TEAM, {
    memberIds,
    newTeamIds,
    preTeamId,
  });
}

/**
 * Invite members(batch available)
 */
export function sendInvite(spaceId: string, invite: IInviteMemberList[], nvcVal?: string) {
  return axios.post(urlcat(Url.SEND_EMAIL_INVITATION, { spaceId }), {
    invite,
    data: nvcVal,
  });
}

/**
 * ReSend email to invite members
 *
 * @param email strict email format
 */
export function reSendInvite(spaceId: string, email: string) {
  return axios.post(urlcat(Url.RESEND_EMAIL_INVITATION, { spaceId }), {
    email,
  });
}

/**
 * Invite Email Verify
 * @param inviteToken one-time invite token
 */
export function inviteEmailVerify(inviteToken: string) {
  return axios.get(urlcat(Url.VALID_EMAIL_INVITATION, { inviteToken }));
}

/**
 * Accept email invitation.
 */
export function acceptEmailInvitation(spaceId: string, inviteToken: string) {
  return axios.post(urlcat(Url.ACCEPT_EMAIL_INVITATION, { spaceId, inviteToken }));
}

/**
 * Upload the contact file
 */
export function uploadMemberFile(formData: any, onUploadProgress: any, ctx: any) {
  return axios.post(Url.UPLOAD_MEMBER_FILE, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress,
    cancelToken: new CancelToken(ctx),
  });
}

/**
 * get the status of the forbidden on exporting the entire space to excel
 */
export function getForbidStatus() {
  return axios.get(Url.FORBID_STATUS);
}

/**
 * generate/refresh the link
 * @param  teamId team ID
 */
export function createLink(teamId: string, nodeId?: string) {
  return axios.post(Url.CREATE_LINK, {
    teamId,
    nodeId,
  });
}

/**
 * Get links list
 * @returns
 */
export function getLinkList() {
  return axios.get(Url.LINK_LIST);
}

/**
 * Delete team invite link
 *
 * @param teamId
 * @returns
 */
export function deleteLink(teamId: string) {
  return axios.delete(Url.DELETE_LINK, { data: { teamId } });
}

/**
 * public link validation
 * @param token
 * @param nodeId
 * @returns
 */
export function linkValid(token: string, nodeId?: string) {
  return axios.post(Url.LINK_VALID, { token, nodeId });
}

/**
 * join space by public link
 *
 * @param token
 * @param nodeId
 * @returns
 */
export function joinViaSpace(token: string, nodeId: string, data?: string) {
  return axios.post(Url.JOIN_VIA_LINK, { token, nodeId, data });
}

export function getCollaboratorListPage(pageObjectParams: string, nodeId: string) {
  return axios.get(Url.COLLABORATOR_LIST_PAGE, {
    params: {
      pageObjectParams,
      nodeId,
    },
  });
}

/**
 * get field permissions page member list
 */

export function getFieldPermissionPageMemberList(dstId: string, fieldId: string, pageObjectParams: string) {
  return axios.get<IApiWrapper & { data: any }>(urlcat(Url.GET_FIELD_PERMISSION_PAGE_MEMBER_LIST, { dstId, fieldId }), {
    params: {
      pageObjectParams,
    },
  });
}
