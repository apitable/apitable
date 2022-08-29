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
    widgetIds = new Set(Object.keys(widgetMap).filter(item => Boolean(widgetMap[item].widget)));
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
