// reducers for data subscribe(follow)
import produce from 'immer';
import { SET_SUBSCRIPTIONS } from '../../../shared/store/action_constants';
import { ISubscriptions, ISetSubscriptionsAction } from '../../../../exports/store/interfaces';

export const subscriptions = produce((subscriptions: ISubscriptions = [], action: ISetSubscriptionsAction) => {
  switch (action.type) {
    case SET_SUBSCRIPTIONS: {
      return action.payload;
    }
    default: {
      return subscriptions;
    }
  }
});
