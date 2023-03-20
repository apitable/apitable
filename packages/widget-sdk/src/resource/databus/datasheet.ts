import { Selectors, databus, IReduxState } from '@apitable/core';
import { IClientLoadDatasheetPackOptions } from './client_data_loader';
import { IClientStoreOptions } from './client_store_provider';

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
        needLoad,
      } as IClientLoadDatasheetPackOptions,
      storeOptions: {
        // recordIds exsits means that only part of recordsIds data is needed @boris
        isPartOfData: Boolean(recordIds),
        needLoad,
      } as IClientStoreOptions,
    });
    if (datasheet) {
      successCb?.(datasheet);
    } else {
      failCb?.();
    }
  };
}
