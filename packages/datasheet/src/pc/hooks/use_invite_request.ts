import { Api, IInviteMemberList } from '@apitable/core';
import { Message } from 'pc/components/common';
import { secondStepVerify } from 'pc/hooks/utils';

export const useInviteRequest = () => {

  /**
   * Get link list
   */
  const linkListReq = () => {
    return Api.getLinkList().then(res => {
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
    return Api.readTeam(teamId).then(res => {
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
    return Api.getSubTeams(teamId).then(res => {
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
    return Api.createLink(teamId, nodeId).then(res => {
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
    return Api.deleteLink(teamId).then(res => {
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
  const sendInviteReq = (invite: IInviteMemberList[], nodeId?: string, nvcVal?: string) => {
    return Api.sendInvite(invite, nodeId, nvcVal).then(res => {
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
    return Api.loadOrSearch({ keyword, searchEmail }).then(res => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
  };

  return { linkListReq, readTeamReq, getSubTeamsReq, generateLinkReq, deleteLinkReq, sendInviteReq, fetchTeamAndMember };
};
