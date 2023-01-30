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

import { difference } from 'lodash';
import { IReduxState, ResourceType } from 'core';
import { Store } from 'redux';
import { eqSet } from './datasheet_map';
import { IResourceService } from 'resource';

export const subscribeWidgetMap = (store: Store<IReduxState>, datasheetService: { instance: IResourceService | null }) => {
  let widgetIds: Set<string> = new Set();
  return store.subscribe(() => {
    const state = store.getState();
    const widgetMap = state.widgetMap;
    if (!widgetMap || !datasheetService.instance?.checkRoomExist()) {
      return;
    }
    const previousWidgetIds = widgetIds;
    widgetIds = new Set(Object.keys(widgetMap).filter(item => Boolean(widgetMap[item]!.widget)));
    if (eqSet(widgetIds, previousWidgetIds)) {
      return;
    }
    const diffOfAdd = difference([...widgetIds], [...previousWidgetIds]);
    const diffOfDelete = difference([...previousWidgetIds], [...widgetIds]);

    if (diffOfAdd.length) {
      for (const v of diffOfAdd) {
        datasheetService.instance.createCollaEngine(v, ResourceType.Widget);
      }
    }

    if (diffOfDelete.length) {
      for (const v of diffOfDelete) {
        datasheetService.instance.reset(v, ResourceType.Widget);
      }
    }
  });
};
