import { Selectors, databus, IReduxState } from '@apitable/core';
import { IClientLoadDatasheetPackOptions } from './client.data.loader';
import { IClientStoreOptions } from './client.store.provider';

export function loadDatasheet(
  database: databus.Database,
  datasheetId: string,
  successCb?: (datasheet?: databus.Datasheet) => void,
  overWrite = false,
  extra?: { recordIds: string[] },
  failCb?: () => void,
) {
  return async(dispatch: any, getState: () => IReduxState) => {
    const state = getState();
    const datasheetState = Selectors.getDatasheet(state, datasheetId);
    const { shareId, templateId, embedId } = state.pageParams;
    const { recordIds } = extra || {};
    const datasheetLoading = Selectors.getDatasheetLoading(state, datasheetId);

    if (datasheetLoading) {
      return;
    }

    const needLoad = !datasheetState || datasheetState.isPartOfData || overWrite;
    const datasheet = await database.getDatasheet(datasheetId, {
      loadOptions: {
        shareId,
        templateId,
        embedId,
        recordIds,
        dispatch,
        getState,
        fakePack: !needLoad,
      } as IClientLoadDatasheetPackOptions,
      storeOptions: {
        // recordIds exits means that only part of recordsIds data is needed @boris
        isPartOfData: Boolean(recordIds),
        fakePack: !needLoad,
      } as IClientStoreOptions,
    });
    if (datasheet) {
      successCb?.(datasheet);
    } else {
      failCb?.();
    }
  };
}
