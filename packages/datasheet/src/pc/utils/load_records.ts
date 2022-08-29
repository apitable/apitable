import { store } from 'pc/store';
import { DatasheetApi, StoreActions, Selectors, IJOTAction, OTActionName, ResourceType } from '@vikadata/core';
import { resourceService } from 'pc/resource_service';
import { remoteActions2Operation } from '@vikadata/widget-sdk';

export async function loadRecords(datasheetId: string, recordIds: string[]) {
  const state = store.getState();
  const client = Selectors.getDatasheetClient(state, datasheetId)!;
  const snapshot = Selectors.getSnapshot(state, datasheetId);

  // 已经在加载中的要过滤掉
  // 已加载过的也要过滤掉
  recordIds = recordIds.filter(recordId => {
    return !client.loadingRecord[recordId] && !snapshot?.recordMap[recordId];
  });

  if (!recordIds.length) {
    return;
  }

  store.dispatch(StoreActions.setLoadingRecord({ recordIds, loading: true }, datasheetId));
  const res = await DatasheetApi.fetchRecords(datasheetId, recordIds);
  const revision = Selectors.getResourceRevision(store.getState(), datasheetId, ResourceType.Datasheet);
  if (res.data.success) {
    const recordRevision = res.data.data.revision;
    const recordMap = res.data.data.recordMap || {};

    // TODO: 处理版本差距问题
    if (recordRevision !== revision) {
      console.warn('! ' + `records 版本: ${recordRevision}和 datasheet 版本: ${revision}不匹配！`);
    }

    const loadedRecordIds = recordIds.filter(recordId => {
      return recordMap[recordId];
    });
    const failRecordIds = recordIds.filter(recordId => {
      return !recordMap[recordId];
    });

    const actions: IJOTAction[] = loadedRecordIds.map(recordId => {
      const record = recordMap[recordId];
      return {
        n: OTActionName.ObjectInsert,
        p: ['recordMap', record.id],
        oi: record,
      };
    });
    store.dispatch(StoreActions.setLoadingRecord({ recordIds: loadedRecordIds, loading: false }, datasheetId));
    store.dispatch(StoreActions.setLoadingRecord({ recordIds: failRecordIds, loading: 'error' }, datasheetId));

    resourceService.instance?.applyOperations(store, [
      {
        resourceType: ResourceType.Datasheet,
        resourceId: datasheetId,
        operations: [remoteActions2Operation(actions)],
      }
    ]);
    return;
  }

  throw new Error('getRecords fail');
}
