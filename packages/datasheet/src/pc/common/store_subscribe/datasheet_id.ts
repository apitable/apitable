import { ResourceType, StoreActions } from '@apitable/core';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getStorage, StorageName } from 'pc/utils/storage/storage';
import { batchActions } from 'redux-batched-actions';
import { expandRecordManager } from '../../../modules/database/expand_record_manager';

let datasheetId: string | undefined;

store.subscribe(function datasheetIdChange() {
  const state = store.getState();
  const spaceId = state.space.activeId || state.share.spaceId || state.embedInfo.spaceId;
  const { shareId, templateId, embedId } = state.pageParams;
  if (!spaceId && !shareId && !templateId && !embedId) {
    return;
  }
  if ((shareId && (!spaceId || !resourceService.instance?.initialized))) {
    return;
  }

  if ((embedId && (!resourceService.instance?.initialized || !state.embedInfo?.spaceId))) {
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
 
  resourceService.instance?.initialized && resourceService.instance?.switchResource({
    from: previousDatasheetId, to: datasheetId as string, resourceType: ResourceType.Datasheet,
  });
 
});
