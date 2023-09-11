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
import { ResourceType, StoreActions } from '@apitable/core';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getStorage, StorageName } from 'pc/utils/storage';
import { expandRecordManager } from '../../../modules/database/expand_record_manager';

let mirrorId: string | undefined;

store.subscribe(function datasheetIdChange() {
  const state = store.getState();
  const spaceId = state.space.activeId || state.share.spaceId;
  const { shareId, templateId } = state.pageParams;
  if (!spaceId && !shareId && !templateId) {
    return;
  }
  if (shareId && (!spaceId || !resourceService.instance?.initialized)) {
    return;
  }
  const previousMirrorId = mirrorId;
  mirrorId = state.pageParams.mirrorId;

  if (!mirrorId || previousMirrorId === mirrorId) {
    return;
  }

  const widgetPanelStatusMap = getStorage(StorageName.WidgetPanelStatusMap);
  if (widgetPanelStatusMap) {
    const widgetPanelStatus = widgetPanelStatusMap[`${spaceId},${mirrorId}`];
    if (widgetPanelStatus) {
      store.dispatch(
        batchActions([
          StoreActions.toggleWidgetPanel(mirrorId, ResourceType.Mirror, widgetPanelStatus.opening),
          StoreActions.changeWidgetPanelWidth(widgetPanelStatus.width, mirrorId, ResourceType.Mirror),
          StoreActions.switchActivePanel(widgetPanelStatus.activePanelId, mirrorId, ResourceType.Mirror),
        ]),
      );
    }
  }

  expandRecordManager.destroy();

  resourceService.instance?.initialized &&
    resourceService.instance!.switchResource({
      from: previousMirrorId,
      to: mirrorId,
      resourceType: ResourceType.Mirror,
    });
});
