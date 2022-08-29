// 数据订阅（关注） store interface
import { SET_SUBSCRIPTIONS } from '../action_constants';

export type ISubscriptions = string[];

export interface ISetSubscriptionsAction {
  type: typeof SET_SUBSCRIPTIONS;
  payload: string[];
}
