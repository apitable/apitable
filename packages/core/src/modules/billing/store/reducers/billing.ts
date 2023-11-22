/**
 * APITable Ltd. <legal@apitable.com>
 * Copyright (C)  2022 APITable Ltd. <https://apitable.com>
 *
 * This code file is part of APITable Enterprise Edition.
 *
 * It is subject to the APITable Commercial License and conditional on having a fully paid-up license from APITable.
 *
 * Access to this code file or other code files in this `enterprise` directory and its subdirectories does not constitute permission to use this code or APITable Enterprise Edition features.
 *
 * Unless otherwise noted, all files Copyright © 2022 APITable Ltd.
 *
 * For purchase of APITable Enterprise Edition license, please contact <sales@apitable.com>.
 */

import { produce } from 'immer';
import { IBilling, IUpdateSubscriptionAction } from '../../../../exports/store/interfaces';
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
}, defaultState);
