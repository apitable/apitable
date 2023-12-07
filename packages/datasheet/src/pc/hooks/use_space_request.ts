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

import { message } from 'antd';
import { useDispatch } from 'react-redux';
import { Api, ApiInterface, Navigation, StoreActions, Strings, t } from '@apitable/core';
import { Message } from 'pc/components/common/message/message';
import { Method } from '../components/route_manager/const';
import { navigationToUrl } from '../components/route_manager/navigation_to_url';
import { Router } from '../components/route_manager/router';
// @ts-ignore
import { isSocialDomain } from 'enterprise/home/social_platform/utils';

export const useSpaceRequest = () => {
  const dispatch = useDispatch();

  const getSpaceListReq = () => {
    return Api.spaceList().then((res) => {
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
    return Api.updateSpace(name).then((res) => {
      const { success } = res.data;
      if (success) {
        dispatch(StoreActions.setSpaceInfo({ spaceName: name }));
        // dispatch(StoreActions.updateUserInfo({ spaceName: name }));
      }
    });
  };

  // Apply to join the space
  const applyJoinSpaceReq = (spaceId: string) => {
    return Api.applyJoinSpace(spaceId).then((res) => {
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
    return Api.getSpaceFeatures().then((res) => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
    });
  };

  // Changing permissions and security settings
  const updateSecuritySettingReq = (config: ApiInterface.IUpdateSecuritySetting) => {
    return Api.updateSecuritySetting(config).then((res) => {
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

  // Determine if a member mailbox exists in the space
  const checkEmailReq = (email: string) => {
    return Api.isExistEmail(email).then((res) => {
      const { success, message, data } = res.data;
      if (success) {
        return data;
      }
      Message.error({ content: message });
    });
  };

  /**
   * Get embed info
   * @param embedId
   */
  const getEmbedInfoReq = (embedId: string) => {
    return Api.getEmbedLinkInfo(embedId).then((res) => {
      const { success, data } = res.data;
      if (success) {
        return data;
      }
      return null;
    });
  };

  const getUserAndRedirect = (spaceId: string) => {
    return Api.getUserMe({ spaceId }).then((res) => {
      const { data, success } = res.data;
      if (success) {
        navigationToUrl(`${window.location.protocol}//${data.spaceDomain || window.location.host}/workbench`, {
          method: Method.Redirect,
          query: {
            spaceId: data.spaceId,
          },
        });
      }
    });
  };

  const createSpaceReq = (name: string) =>
    Api.createSpace(name).then((res) => {
      const { success, code, message, data } = res.data;
      if (success) {
        // Compatible with corporate domain name creation space station jump
        if (isSocialDomain?.()) {
          getUserAndRedirect(data.spaceId);
        }
        dispatch(StoreActions.updateUserInfo({ needCreate: false }));
        Router.push(Navigation.WORKBENCH, { params: { spaceId: data.spaceId } });
      } else {
        dispatch(
          StoreActions.setSpaceErr({
            code,
            msg: message,
          }),
        );
      }
      return res.data;
    });

  return {
    changeSpaceNameReq,
    getSpaceListReq,
    applyJoinSpaceReq,
    spaceFeaturesReq,
    getEmbedInfoReq,
    checkEmailReq,
    updateSecuritySettingReq,
    getUserAndRedirect,
    createSpaceReq,
  };
};
