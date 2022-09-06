import { ISubscription } from '@vikadata/core';
import { showVikaby } from 'pc/common/guide/vikaby';
import { usageWarnModal } from 'pc/components/subscribe_system/usage_warn_modal/usage_warn_modal';
import { subscribeUsageCheck, SubscribeUsageTipType } from './subscribe_usage_check';

export const triggerUsageAlert = (functionName: keyof ISubscription, extra?: Record<string, any>, tipType?: SubscribeUsageTipType) => {
  const result = subscribeUsageCheck.triggerVikabyAlert(functionName, extra);

  if (!result) {
    return;
  }

  const { title, content } = result;

  if (tipType === SubscribeUsageTipType.Alert) {
    return usageWarnModal({ alertContent: content });
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
