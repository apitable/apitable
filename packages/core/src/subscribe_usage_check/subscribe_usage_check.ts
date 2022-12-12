import { AnyAction, Store } from 'redux';
// @ts-ignore
import { ISubscription } from '../modules/enterprise';
import { IReduxState } from '../exports/store';

export class SubscribeUsageCheck {

  constructor(private store: Store<IReduxState, AnyAction>) { }
  /**
    * @description According to functionName , check whether the current value exceeds the limit of the specification
    * @param {keyof ISubscription} functionName
    * @param usage The current usage, which can be omitted for subscription functions
    * @returns {boolean} true - usage is within limit; false - usage exceeds limit
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

