import * as actions from '../action_constants';
import { ISubscription } from '../interface';

export function updateSubscription(info: ISubscription | undefined) {
  return {
    type: actions.UPDATE_SUBSCRIPTION,
    payload: info,
  };
}
