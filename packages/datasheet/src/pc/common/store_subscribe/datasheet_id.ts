import { ResourceType, StoreActions } from '@vikadata/core';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getStorage, StorageName } from 'pc/utils/storage/storage';
import { batchActions } from 'redux-batched-actions';
import { expandRecordManager } from '../expand_record_manager';

let datasheetId: string | undefined;

store.subscribe(function datasheetIdChange() {
  const state = store.getState();
  const spaceId = state.space.activeId || state.share.spaceId;
  const { shareId, templateId } = state.pageParams;
  if (!spaceId && !shareId && !templateId) {
    return;
  }
  if ((shareId && (!spaceId || !resourceService.instance?.initialized))) {
    return;
  }

  if (state.pageParams.mirrorId) {
    // 从数表进入 mirror，由于 url 中存在 datasheetId ,所以这里依旧会存储数据，
    // 当路由跳转会数表，则不会被触发 watchRoom
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

  resourceService.instance?.switchResource({
    from: previousDatasheetId, to: datasheetId, resourceType: ResourceType.Datasheet,
  });
});
