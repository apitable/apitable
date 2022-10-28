import { byteMG, isPrivateDeployment, ISubscription, Strings, SubscribeUsageCheck, t } from '@apitable/core';
import { underscore } from 'naming-style';
import { IExtra } from 'pc/common/billing/interface';
import { store as storeState } from 'pc/store';
import { isMobileApp } from 'pc/utils/env';
import store, { StoreAPI } from 'store2';

const SUBSCRIBE_USAGE = 'SUBSCRIBE_USAGE';

class SubscribeUsageCheckEnhance extends SubscribeUsageCheck {
  private storage: StoreAPI;

  constructor(props) {
    super(props);
    this.storage = store.namespace(SUBSCRIBE_USAGE);
  }

  // Record data in localstorage, set expiry time
  // Read data from localstorage
  triggerVikabyAlert(functionName: keyof ISubscription, extra?: IExtra) {
    if (document.querySelector('.VIKABY_SUB_POPOVER_CONTENT')) {
      return;
    }

    // Check if it has been triggered in the current time period
    if (!this.shouldAlertToUser(functionName, extra?.usage, extra?.alwaysAlert)) {
      return;
    }

    const state = storeState.getState();
    const subscription = state.billing.subscription!;
    const title = typeof subscription[functionName] !== 'number' ? t(Strings.billing_subscription_warning) : t(Strings.billing_usage_warning);
    const content =
      extra?.message ||
      t(Strings[underscore(functionName)], {
        usage: functionName === 'maxCapacitySizeInBytes' ? byteMG(Number(extra?.usage)) : extra?.usage,
        specification: functionName === 'maxCapacitySizeInBytes' ? byteMG(subscription[functionName]) : subscription[functionName],
        grade: extra?.grade || '',
      });

    // this.triggerNotifyAdmin(functionName, extra);

    return {
      content,
      title,
      spaceId: state.space.activeId,
    };
  }

  /**
   * @description Depending on business requirements, the same usage warning will only appear once in a day
   * The data is stored in localstorage, before each prompt, check if the prompt appears in local, and pop up the prompt only if it does not.
   * In addition, warnings for usage alerts need to be sent to the administrator, but they are only sent once a day, 
   * so it means that only the first triggered warning will be notified
   */
  shouldAlertToUser(functionName: keyof ISubscription, usage?: any, readonly?: boolean) {
    const state = storeState.getState();
    const userInfo = state.user.info;

    if (!userInfo?.sendSubscriptionNotify) {
      // If the global switch is turned off, user notification is disabled
      return false;
    }

    if (isMobileApp()) {
      // No prompt on app
      return false;
    }

    if (isPrivateDeployment()) {
      // Public cloud environments are also not prompted
      return false;
    }

    if (super.underUsageLimit(functionName, usage)) {
      // Check that the functional dosage criteria are met
      return false;
    }

    const spaceId = state.space.activeId;
    const result = this.storage.get(spaceId);

    if (readonly) {
      return true;
    }

    if (!result || result.expireDate < Date.now()) {
      this.storage.set(spaceId, {
        // Reminder expiry time adjusted to 2 days
        expireDate: new Date().setHours(24, 0, 0, 0) + 86400000,
        alertFunctionName: [functionName],
      });
      return true;
    }

    if (!result.alertFunctionName.includes(functionName)) {
      result.alertFunctionName.push(functionName);
      this.storage.set(spaceId, result);
      return true;
    }

    return false;
  }
  
  // private triggerNotifyAdmin(functionName: keyof ISubscription, extra?: Record<string, any>) {
  //   const state = storeState.getState();
  //   const spaceId = state.space.activeId;
  //   const result = this.storage.get(spaceId);
  //   const subscription = state.billing.subscription!;
  //   if (result.alertFunctionName.length !== 1) {
  //     return;
  //   }
  //   // const idMap = SystemConfig.billing.notify;
  //   const idMap = {};
  //   Api.subscribeRemind({
  //     usage: extra?.usage + '',
  //     specification: subscription[functionName] + '',
  //     templateId: idMap?.[underscore(functionName)]?.link_notification_id?.[0] || '',
  //     spaceId: spaceId!,
  //   });
  // }
}

export const subscribeUsageCheck = new SubscribeUsageCheckEnhance(storeState);
