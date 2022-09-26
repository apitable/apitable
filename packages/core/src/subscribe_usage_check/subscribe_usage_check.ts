import { AnyAction, Store } from 'redux';
import { IReduxState, ISubscription } from 'store';

export class SubscribeUsageCheck {

  constructor(private store: Store<IReduxState, AnyAction>) { }

  /**
   * @description 根据 functionName ，检查当前的值是否超过规格的限制
   * @param {keyof ISubscription} functionName
   * @param usage 当前的使用量，对于订阅型的功能可以不传
   * @returns {boolean} true - 用量在限制内；false - 用量超过限制
   */
  underUsageLimit(functionName: keyof ISubscription, usage?: any) {
    const state = this.store.getState();
    const subscription = state.billing.subscription;

    if (!subscription) {
      return true;
    }

    if (typeof subscription[functionName] === 'number' && usage !== null) {
      if (subscription[functionName] === -1) {
        return true;
      }

      if (subscription[functionName] === 0) {
        return false;
      }

      return usage <= subscription[functionName];
    }

    return Boolean(subscription[functionName]);
  }
}

