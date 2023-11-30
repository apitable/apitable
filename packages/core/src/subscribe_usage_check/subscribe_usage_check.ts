/**
 * APITable <https://github.com/apitable/apitable>
 * Copyright (C) 2022 APITable Ltd. <https://apitable.com>
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU Affero General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU Affero General Public License for more details.
 *
 * You should have received a copy of the GNU Affero General Public License
 * along with this program.  If not, see <http://www.gnu.org/licenses/>.
 */

import { AnyAction, Store } from 'redux';
// @ts-ignore
import { ISubscription } from '../modules/enterprise';
import { IReduxState } from '../exports/store/interfaces';

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
    const subscription = state.billing?.subscription;

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

