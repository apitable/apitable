// data subscription (follow) store interface
import { SET_SUBSCRIPTIONS } from '../../../shared/store/action_constants';

export type ISubscriptions = string[];

export interface ISetSubscriptionsAction {
  type: typeof SET_SUBSCRIPTIONS;
  payload: string[];
}
