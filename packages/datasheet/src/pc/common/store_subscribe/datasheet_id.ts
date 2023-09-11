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

import { batchActions } from 'redux-batched-actions';
import { ResourceType, StoreActions, WasmApi } from '@apitable/core';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getStorage, StorageName } from 'pc/utils/storage/storage';
import { expandRecordManager } from '../../../modules/database/expand_record_manager';

let datasheetId: string | undefined;

store.subscribe(function datasheetIdChange() {
  const state = store.getState();
  const spaceId = state.space.activeId || state.share.spaceId || state.embedInfo.spaceId;
  const { shareId, templateId, embedId } = state.pageParams;
  if (!spaceId && !shareId && !templateId && !embedId) {
    return;
  }
  if (shareId && (!spaceId || !resourceService.instance?.initialized)) {
    return;
  }
  if (embedId && (!spaceId || !resourceService.instance?.initialized || !state.embedInfo?.spaceId)) {
    return;
  }

  if (state.pageParams.mirrorId) {
    // From the datasheet into the mirror, the datasheetId is present in the url, so the data is still stored here.
    // When a route jumps through the session table, it will not be triggered watchRoom
    datasheetId = undefined;
    return;
  }
  const previousDatasheetId = datasheetId;
  datasheetId = state.pageParams.datasheetId;

  if (!datasheetId || previousDatasheetId === datasheetId) {
    return;
  }

  expandRecordManager.destroy();

  const widgetPanelStatusMap = getStorage(StorageName.WidgetPanelStatusMap);
  if (widgetPanelStatusMap) {
    const widgetPanelStatus = widgetPanelStatusMap[`${spaceId},${datasheetId}`];
    if (widgetPanelStatus) {
      store.dispatch(
        batchActions([
          StoreActions.toggleWidgetPanel(datasheetId, ResourceType.Datasheet, widgetPanelStatus.opening),
          StoreActions.changeWidgetPanelWidth(widgetPanelStatus.width, datasheetId, ResourceType.Datasheet),
          StoreActions.switchActivePanel(widgetPanelStatus.activePanelId, datasheetId, ResourceType.Datasheet),
        ]),
      );
    }
  }

  const widgetMapKey = Object.keys(state.widgetMap);
  if (widgetMapKey.length) {
    store.dispatch(StoreActions.resetWidget(widgetMapKey));
  }

  setTimeout(() => {
    if (WasmApi.getBrowserDatabusApiEnabled()) {
      WasmApi.initializeDatabusWasm().then(() => {
        resourceService.instance?.initialized &&
          resourceService.instance?.switchResource({
            from: previousDatasheetId,
            to: datasheetId as string,
            resourceType: ResourceType.Datasheet,
          });
      });
      return;
    }
    resourceService.instance?.initialized &&
      resourceService.instance?.switchResource({
        from: previousDatasheetId,
        to: datasheetId as string,
        resourceType: ResourceType.Datasheet,
      });
  }, 200);
});
