import { ISubscription, Strings, t } from '@apitable/core';
import { IExtra } from 'modules/enterprise/billing/interface';
import { showVikaby } from 'pc/components/enterprise/vikaby';
import { Message } from 'pc/components/common';
import { usageWarnModal } from 'pc/components/subscribe_system/usage_warn_modal/usage_warn_modal';
import { isMobile } from 'react-device-detect';
import { subscribeUsageCheck } from './subscribe_usage_check';

export enum SubscribeUsageTipType {
  Vikaby,
  Alert,
}

export const triggerUsageAlert = (functionName: keyof ISubscription, extra?: IExtra, tipType?: SubscribeUsageTipType): boolean => {
  const result = subscribeUsageCheck.triggerVikabyAlert(functionName, extra);

  if (!result) {
    return false;
  }

  const { title, content } = result;

  if (tipType === SubscribeUsageTipType.Alert) {
    if (isMobile) {
      Message.warning({
        content: t(Strings.mobile_usage_over_limit_tip),
      });
      return true;
    }
    usageWarnModal({ alertContent: content, reload: extra?.reload });
    return true;
  }

  showVikaby({
    defaultExpandDialog: true,
    dialogConfig: {
      title,
      content,
      dialogClx: 'billingNotify',
    },
  });
  return true;
};

export const triggerUsageAlertForDatasheet = (content: string) => {
  if (isMobile) {
    Message.warning({
      content: t(Strings.mobile_usage_over_limit_tip),
    });
    return;
  }
  usageWarnModal({ alertContent: content, reload: true });
};
