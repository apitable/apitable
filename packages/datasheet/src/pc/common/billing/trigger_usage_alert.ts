import { subscribeUsageCheck, SubscribeUsageTipType } from './subscribe_usage_check';
import { showVikaby } from 'pc/common/guide/vikaby';
import { showBannerAlert } from 'pc/components/notification/banner_alert';
import { ISubscription } from '@vikadata/core';
import { goToUpgrade } from 'pc/components/subscribe_system';

export const triggerUsageAlert = (functionName: keyof ISubscription, extra?: Record<string, any>, tipType?: SubscribeUsageTipType) => {
  const result = subscribeUsageCheck.triggerVikabyAlert(functionName, extra);

  if (!result) {
    return;
  }

  const { title, content } = result;

  if (tipType === SubscribeUsageTipType.Alert) {
    showBannerAlert({
      content: content,
      closable: true,
      upgrade: true,
      onBtnClick: goToUpgrade
    });
  }
  showVikaby({
    defaultExpandDialog: true,
    dialogConfig: {
      title,
      content,
      dialogClx: 'billingNotify',
    },
  });
};
