import { getDatasheet, getDatasheetLoading } from 'exports/store/selectors';
import { databus, IReduxState } from 'index';
import { IClientLoadDatasheetPackOptions } from './data.loader';

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
    const datasheet = getDatasheet(state, datasheetId);
    const { shareId, templateId, embedId } = state.pageParams;
    const { recordIds } = extra || {};
    const datasheetLoading = getDatasheetLoading(state, datasheetId);

    if (datasheetLoading) {
      return;
    }

    if (!datasheet || datasheet.isPartOfData || overWrite) {
      database
        .getDatasheet(datasheetId, {
          shareId,
          templateId,
          embedId,
          recordIds,
          dispatch,
          getState,
        } as IClientLoadDatasheetPackOptions & databus.IDatasheetOptions)
        .then(datasheet => {
          datasheet ? successCb && successCb(datasheet) : failCb && failCb();
        });
    }
    successCb && successCb();
    return;
  };
}
