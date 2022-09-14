import { Api, IInviteMemberList } from '@vikadata/core';
import { Message } from 'pc/components/common';
import { secondStepVerify } from 'pc/hooks/utils';

export const useInviteRequest = () => {

  /**
   * 获取链接列表
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
   * 查询部门信息
   * @param teamId 部门ID（0：表示根部门）
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
   * 查询直属子部门列表
   * @param teamId 部门ID
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
   * 生成-刷新链接
   * @param teamId 部门ID
   */
  const generateLinkReq = (teamId: string) => {
    return Api.createLink(teamId).then(res => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
  };

  /**
   * 删除链接
   * @param teamId 部门ID
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
   * 发送邮件邀请成员
   */
  const sendInviteReq = (invite: IInviteMemberList[], nodeId?: string, nvcVal?: string) => {
    return Api.sendInvite(invite, nodeId, nvcVal).then(res => {
      const { success, message, code } = res.data;
      if (success) {
        return true;
      }
      Message.error({ content: message });
      secondStepVerify(code);
      return false;
    });
  };

  return { linkListReq, readTeamReq, getSubTeamsReq, generateLinkReq, deleteLinkReq, sendInviteReq };
};
