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

  // Self-built applications - Contact Support
  if (social?.appType === 1) {
    return false;
  }

  // Third-party applications
  if (social?.appType === 2 && social.enabled) {
    // Wecom
    if (social.platform === 1) {
      return false;
    }
    // Dingtalk
    if (social.platform === 2) {
      return false;
    }
    // Feishu
    if (social.platform === 3) {
      if (user?.isAdmin) {
        return false;
      }
      return false;
    }
  }
  return true;
};
