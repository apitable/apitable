// 数据订阅（关注） reducers
import produce from 'immer';
import { SET_SUBSCRIPTIONS } from '../action_constants';
import { ISubscriptions, ISetSubscriptionsAction } from '../interface';

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
