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

import { Api, ApiInterface, StoreActions, Strings, t } from '@apitable/core';
import { message } from 'antd';
import { Message } from 'pc/components/common';
import { useDispatch } from 'react-redux';

export const useSpaceRequest = () => {
  const dispatch = useDispatch();

  const getSpaceListReq = () => {
    return Api.spaceList().then(res => {
      const { success, data, message } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
      return null;
    });
  };

  // Space name change (used to automatically change the default space name after changing your personal nickname in the newbie guide)
  const changeSpaceNameReq = (name: string) => {
    return Api.updateSpace(name).then(res => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.setSpaceInfo({ spaceName: name }));
        // dispatch(StoreActions.updateUserInfo({ spaceName: name }));
      }
    });
  };

  // Apply to join the space
  const applyJoinSpaceReq = (spaceId: string) => {
    return Api.applyJoinSpace(spaceId).then(res => {
      const { success, message } = res.data;
      if (success) {
        Message.success({ content: t(Strings.apply_join_space_success) });
      } else {
        Message.error({ content: message });
      }
    });
  };

  // Acquisition of spatial characteristics
  const spaceFeaturesReq = () => {
    return Api.getSpaceFeatures().then(res => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
    });
  };

  // Changing permissions and security settings
  const updateSecuritySettingReq = (config: ApiInterface.IUpdateSecuritySetting) => {
    return Api.updateSecuritySetting(config).then(res => {
      const { success } = res.data;
      message.config({
        top: 120,
      });
      if (success) {
        Message.success({ content: t(Strings.operate_success) });
      } else {
        Message.error({ content: t(Strings.operate_fail) });
      }
      message.config({
        top: 80,
      });
      return res.data;
    });
  };

  // Changing member settings
  const updateMemberSettingReq = (data: { invitable?: boolean, joinable?: boolean, mobileShowable?: boolean }) => {
    return Api.updateMemberSetting(data).then(res => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.operate_success) });
      } else {
        Message.error({ content: t(Strings.operate_fail) });
      }
      return res.data;
    });
  };
  // Changing workbench settings
  const updateWorkbenchSettingReq = (data: { nodeExportable?: boolean, watermarkEnable?: boolean }) => {
    return Api.updateWorkbenchSetting(data).then(res => {
      const { success } = res.data;
      if (success) {
        Message.success({ content: t(Strings.operate_success) });
      } else {
        Message.error({ content: t(Strings.operate_fail) });
      }
      return res.data;
    });
  };

  // Determine if a member mailbox exists in the space
  const checkEmailReq = (email: string) => {
    return Api.isExistEmail(email).then(res => {
      const { success, message, data } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
  };

  /**
   * Get embed info
   * @param nodeId 
   * @param data 
   */
  const getEmbedInfoReq = (
    embedId: string,
  ) => {
    return Api.getEmbedLinkInfo(embedId).then(res => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return null;
    });
  };

  return {
    changeSpaceNameReq, getSpaceListReq, applyJoinSpaceReq, spaceFeaturesReq, getEmbedInfoReq,
    checkEmailReq, updateMemberSettingReq, updateWorkbenchSettingReq, updateSecuritySettingReq
  };
};

