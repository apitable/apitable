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
  IApiWrapper, ILocateIdMap,
  IUserInfo,
} from '../../../exports/store/interfaces';

/**
 *
 * Get My Info
 *
 * @param locateIdMap
 * @param filter
 * @param headers
 * @returns
 */
export function getUserMe(locateIdMap: ILocateIdMap = { spaceId: '', nodeId: '' }, filter = false, headers?: Record<string, string>) {
  return axios.get<IApiWrapper & { data: IUserInfo }>(Url.USER_ME, {
    params: {
      ...locateIdMap,
      filter,
    },
    headers,
  });
}

/**
 * Check user can delete or close
 * @returns
 */
export function getUserCanLogout() {
  return axios.get<IApiWrapper & { data: boolean }>(Url.USER_CAN_LOGOUT);
}

/**
 *
 * Space - binding the invited email
 *
 * @param spaceId
 * @param email
 * @returns
 */
export function linkInviteEmail(spaceId: string, email: string) {
  return axios.post(Url.LINK_INVITE_EMAIL, { spaceId, email });
}

/**
 * invite code reward
 */
export function submitInviteCode(inviteCode: string) {
  return axios.post(Url.INVITE_CODE_REWARD, { inviteCode });
}

/**
 * Space - check if the user has bound the email
 */
export function emailBind() {
  return axios.get(Url.EMAIL_BIND);
}

/**
 * Update (Edit) the user info
 * @param info
 */
export function updateUser(info: {
  avatar?: string;
  avatarColor?: number | null;
  nickName?: string | null;
  locale?: string;
  init?: boolean;
  timeZone?: string;
}) {
  return axios.post(Url.UPDATE_USER, info);
}

/**
 * Edit Member Info and nickname
 * @param memberName nickname
 */
export function updateOwnerMemberInfo(memberName: string) {
  return axios.post(Url.MEMBER_UPDATE, { memberName });
}

