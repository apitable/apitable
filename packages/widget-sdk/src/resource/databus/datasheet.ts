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
  return (dispatch: any, getState: () => IReduxState) => {
    const state = getState();
    const datasheet = Selectors.getDatasheet(state, datasheetId);
    const { shareId, templateId, embedId } = state.pageParams;
    const { recordIds } = extra || {};
    const datasheetLoading = Selectors.getDatasheetLoading(state, datasheetId);

    if (datasheetLoading) {
      return;
    }

    if (!datasheet || datasheet.isPartOfData || overWrite) {
      database
        .getDatasheet(datasheetId, {
          loadOptions: {
            shareId,
            templateId,
            embedId,
            recordIds,
            dispatch,
            getState,
          } as IClientLoadDatasheetPackOptions,
          storeOptions: {
            // recordIds exits means that only part of recordsIds data is needed @boris
            isPartOfData: Boolean(recordIds),
          } as IClientStoreOptions,
        })
        .then(datasheet => {
          datasheet ? successCb && successCb(datasheet) : failCb && failCb();
        });
    }
    successCb && successCb();
    return;
  };
}
