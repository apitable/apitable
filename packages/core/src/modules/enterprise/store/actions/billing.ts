import * as actions from '../../../shared/store/action_constants';
import { ISubscription } from '../../../../store/interfaces';

export function updateSubscription(info: ISubscription | undefined) {
  return {
    type: actions.UPDATE_SUBSCRIPTION,
    payload: info,
  };
}
