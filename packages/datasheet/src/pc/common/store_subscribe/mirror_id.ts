import { ResourceType, StoreActions } from '@apitable/core';
import { resourceService } from 'pc/resource_service';
import { store } from 'pc/store';
import { getStorage, StorageName } from 'pc/utils/storage';
import { batchActions } from 'redux-batched-actions';
import { expandRecordManager } from '../../../modules/database/expand_record_manager';

let mirrorId: string | undefined;

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

  resourceService.instance?.initialized && resourceService.instance!.switchResource({
    from: previousMirrorId, to: mirrorId, resourceType: ResourceType.Mirror,
  });
});
