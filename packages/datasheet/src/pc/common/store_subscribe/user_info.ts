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

import { Events, IUserInfo, Player } from '@apitable/core';
import { NotificationStore } from 'pc/notification_store';
import { store } from 'pc/store';

let userInfo: IUserInfo | undefined | null;

// Synchronize redux user information to __initialization_data__.userInfo
function updateWindowUserInfo(userInfo: IUserInfo) {
  if (!window.__initialization_data__) (window as any).__initialization_data__ = {};
  if (!window.__initialization_data__.userInfo) {
    window.__initialization_data__.userInfo = userInfo;
  }
}

store.subscribe(function userInfoChange() {
  const previousUserInfo = userInfo;
  const state = store.getState();
  userInfo = state.user.info;
  if (!userInfo) {
    return;
  }

  if (!previousUserInfo || previousUserInfo.uuid !== userInfo.uuid) {
    updateWindowUserInfo(userInfo);
    Player.doTrigger(Events.app_set_user_id, userInfo);
    NotificationStore.init(userInfo.uuid, userInfo.spaceId);
  }
});
