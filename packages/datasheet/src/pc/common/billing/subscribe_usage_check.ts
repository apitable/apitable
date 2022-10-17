import { byteMG, isPrivateDeployment, ISubscription, Strings, SubscribeUsageCheck, t } from '@vikadata/core';
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

  // 在 localstorage 记录数据，设置过期时间
  // 从 localstorage 中读取数据
  triggerVikabyAlert(functionName: keyof ISubscription, extra?: IExtra) {
    if (document.querySelector('.VIKABY_SUB_POPOVER_CONTENT')) {
      return;
    }

    // 检查在当前时间段内是否触发过
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
   * @description 根据业务需求，同一种用量警告，一天内只出现一次
   * 数据存储在 localstorage 中，每次提示前，检查该种提示是否有出现在 local 中，没有才弹出提示
   * 另外，用量提示的警告需要发送给管理员，但一天只发送一次，所以说只有第一次触发的警告才会有通知
   */
  shouldAlertToUser(functionName: keyof ISubscription, usage?: any, readonly?: boolean) {
    const state = storeState.getState();
    const userInfo = state.user.info;

    if (!userInfo?.sendSubscriptionNotify) {
      // 全局开关关闭，则禁止通知用户
      return false;
    }

    if (isMobileApp()) {
      // app 上不提示
      return false;
    }

    if (isPrivateDeployment()) {
      // 公有云环境也不进行提示
      return false;
    }

    if (super.underUsageLimit(functionName, usage)) {
      // 检查是否达到功能用量的标准
      return false;
    }

    const spaceId = state.space.activeId;
    const result = this.storage.get(spaceId);

    if (readonly) {
      return true;
    }

    if (!result || result.expireDate < Date.now()) {
      this.storage.set(spaceId, {
        // 提醒的过期时间调整为 2 天
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

  // 通知管理员
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
