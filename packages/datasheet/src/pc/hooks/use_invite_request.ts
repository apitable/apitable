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

import { Api, IInviteMemberList } from '@apitable/core';
import { Message } from 'pc/components/common';
import { secondStepVerify } from 'pc/hooks/utils';

export const useInviteRequest = () => {
  /**
   * Get link list
   */
  const linkListReq = () => {
    return Api.getLinkList().then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
  };

  /**
   * Search for departmental information
   * @param teamId
   */
  const readTeamReq = (teamId = '0') => {
    return Api.readTeam(teamId).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
  };

  /**
   * Search the list of direct sub-departments
   * @param teamId
   */
  const getSubTeamsReq = (teamId: string) => {
    return Api.getSubTeams(teamId).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
  };

  /**
   * Generate - Refresh link
   * @param teamId
   */
  const generateLinkReq = (teamId: string, nodeId?: string) => {
    return Api.createLink(teamId, nodeId).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
  };

  /**
   * Delete link
   * @param teamId
   */
  const deleteLinkReq = (teamId: string) => {
    return Api.deleteLink(teamId).then((res) => {
      const { success, message } = res.data;
      if (success) {
        return true;
      }
      Message.error({ content: message });
      return false;
    });
  };

  /**
   * Send an email to invite members
   */
  const sendInviteReq = (spaceId: string, invite: IInviteMemberList[], nvcVal?: string) => {
    return Api.sendInvite(spaceId, invite, nvcVal).then((res) => {
      const { success, message, code, data } = res.data;
      if (!success) {
        Message.error({ content: message });
        secondStepVerify(code);
      }
      return { success, data };
    });
  };

  /**
   * Search for members and groups
   * @param keyword
   */
  const fetchTeamAndMember = (keyword: string, searchEmail: boolean) => {
    return Api.loadOrSearch({ keyword, searchEmail }).then((res) => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
  };

  return { linkListReq, readTeamReq, getSubTeamsReq, generateLinkReq, deleteLinkReq, sendInviteReq, fetchTeamAndMember };
};
