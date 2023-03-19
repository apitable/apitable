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

// reducers for data subscribe(follow)
import produce from 'immer';
import { ISetSubscriptionsAction, ISubscriptions } from '../../../../exports/store/interfaces';
import { SET_SUBSCRIPTIONS } from '../../../shared/store/action_constants';

export const subscriptions = produce((subscriptions: ISubscriptions = [], action: ISetSubscriptionsAction) => {
  switch (action.type) {
    case SET_SUBSCRIPTIONS: {
      return action.payload;
    }
    default: {
      return subscriptions;
    }
  }
}, [] as ISubscriptions);
