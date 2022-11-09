
import { IBilling, IUpdateSubscriptionAction } from '../../../../store/interfaces';
import { produce } from 'immer';
import * as actions from '../../../shared/store/action_constants';

type IHooksActions = IUpdateSubscriptionAction;

const defaultState: IBilling = {
  catalog: {},
  pruducts: {},
  plans: {},
  features: {},
  subscription: null,
};
export const billing = produce((data: IBilling = defaultState, action: IHooksActions) => {
  switch (action.type) {
    case actions.UPDATE_SUBSCRIPTION: {
      data.subscription = action.payload;
      return data;
    }
    default:
      return data;
  }
});
