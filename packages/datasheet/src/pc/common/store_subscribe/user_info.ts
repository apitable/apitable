import { Events, IUserInfo, Player } from '@apitable/core';
import { store } from 'pc/store';
import { NotificationStore } from 'pc/notification_store';

let userInfo: IUserInfo | undefined | null;

// Synchronize redux user information to __initialization_data__.userInfo
function updateWindowUserInfo(userInfo: IUserInfo) {
  if(!window.__initialization_data__) (window as any).__initialization_data__ = {};
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
