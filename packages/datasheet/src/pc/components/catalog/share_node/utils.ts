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

import { IUserInfo } from '@apitable/core';

/**
 * Invitation link generation
 */
export const generateInviteLink = (userInfo: IUserInfo | null, token: string, nodeId: string) => {
  const url = new URL(window.location.origin);
  url.pathname = '/invite/link';

  const searchParams = new URLSearchParams('');

  searchParams.append('token', token);
  userInfo?.inviteCode && searchParams.append('inviteCode', userInfo.inviteCode);
  searchParams.append('nodeId', nodeId);
  url.search = searchParams.toString();
  return url.href;
};

export const ROOT_TEAM_ID = '0';
