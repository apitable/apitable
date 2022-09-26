import { store } from 'pc/store';

export const isSaaSApp = () => {
  const state = store.getState();
  const spaceInfo = state.space.curSpaceInfo;
  const subscription = state.billing.subscription;
  const social = spaceInfo?.social;
  const user = state.user.info;

  if (social?.appType == null && subscription?.product !== 'Bronze') {
    return true;
  }

  // 自建应用 - 联系客服
  if (social?.appType === 1) {
    return false;
  }

  // 第三方应用
  if (social?.appType === 2 && social.enabled) {
    // 企微 - 联系客服
    if (social.platform === 1) {
      return false;
    }
    // 钉钉
    if (social.platform === 2) {
      return false;
    }
    // 飞书 - 联系客服
    if (social.platform === 3) {
      if (user?.isAdmin) {
        return false;
      }
      return false;
    }
  }
  return true;
};
