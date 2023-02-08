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

import { ActionConstants, ICacheTemporaryView, IJOTActionPayload, Selectors, StoreActions, visibleRowsBaseCacheManage } from '@apitable/core';

type IUpdateCacheAction = StoreActions.IUpdateFieldPermissionMapAction | ICacheTemporaryView | IJOTActionPayload;
export function rowsCacheAction({ getState }: any) {
  return (next: (arg0: IUpdateCacheAction) => any) => (action: IUpdateCacheAction) => {
    const state = getState();
    switch(action.type) {
      // Update fieldPermission
      case ActionConstants.UPDATE_FIELD_PERMISSION_MAP: {
        visibleRowsBaseCacheManage.updateVisibleRowsBaseCacheData = {
          datasheetId: action.datasheetId,
        };
      } break;
      // Update filter information for mirror
      case ActionConstants.CACHE_TEMPORARY_VIEW: {
        const mirrorInfo = Selectors.getMirrorSourceInfo(state, action.mirrorId);
        if (!mirrorInfo) {
          return;
        }
        visibleRowsBaseCacheManage.updateVisibleRowsBaseCacheData = {
          datasheetId: mirrorInfo.datasheetId,
          viewIds: [mirrorInfo.viewId],
          mirrorId: action.mirrorId
        };
      } break;
      // jot action apply
      case ActionConstants.DATASHEET_JOT_ACTION: {
        visibleRowsBaseCacheManage.updateVisibleRowsBaseCache(action, state);
      } break;
    }
    return next(action);
  };
}
