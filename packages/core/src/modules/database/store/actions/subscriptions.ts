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

import * as ActionConstants from 'modules/shared/store/action_constants';
import { ISubscriptions } from 'exports/store/interfaces';
import { getSubscriptions } from '../../api/datasheet_api';

/**
 * get current datasheet/mirrors' subscribed(followed) record ids
 * @param datasheetId
 * @param mirrorId
 * @returns
 */
export const getSubscriptionsAction = (datasheetId: string, mirrorId?: string) => async (dispatch: any) => {
  const { data } = await getSubscriptions(datasheetId, mirrorId);

  if (data?.success) {
    dispatch(setSubscriptionsAction(data.data || []));
  }
};

/**
 * update current subscribed(followed) records ids
 * @param recordIds
 * @returns
 */
export const setSubscriptionsAction = (recordIds: ISubscriptions) => ({
  type: ActionConstants.SET_SUBSCRIPTIONS,
  payload: recordIds,
});
